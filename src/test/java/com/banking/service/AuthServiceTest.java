package com.banking.service;

import com.banking.dto.AuthResponse;
import com.banking.dto.LoginRequest;
import com.banking.dto.RegisterRequest;
import com.banking.dto.UserResponse;
import com.banking.entity.Role;
import com.banking.entity.User;
import com.banking.exception.UserAlreadyExistsException;
import com.banking.mapper.UserMapper;
import com.banking.repository.UserRepository;
import com.banking.security.JwtTokenProvider;
import com.banking.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;
    private UserResponse userResponse;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .name("John Doe")
                .email("john@example.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .build();

        loginRequest = LoginRequest.builder()
                .email("john@example.com")
                .password("password123")
                .build();

        user = User.builder()
                .id(1L)
                .name("John Doe")
                .email("john@example.com")
                .password("encoded_password")
                .role(Role.CUSTOMER)
                .build();

        userResponse = UserResponse.builder()
                .id(1L)
                .name("John Doe")
                .email("john@example.com")
                .role(Role.CUSTOMER)
                .build();
    }

    @Test
    void register_Success() {
        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        UserResponse result = authService.register(registerRequest);

        assertNotNull(result);
        assertEquals("john@example.com", result.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("jwt_token_example");
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("jwt_token_example", response.getToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals("john@example.com", response.getEmail());
    }
}
