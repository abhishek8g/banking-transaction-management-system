package com.banking.service.impl;

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
import com.banking.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        logger.info("Processing user registration for email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Registration failed: Email {} already exists", request.getEmail());
            throw new UserAlreadyExistsException("User already exists with email: " + request.getEmail());
        }

        Role role = request.getRole() != null ? request.getRole() : Role.CUSTOMER;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);
        logger.info("Successfully registered user with ID: {} and Role: {}", savedUser.getId(), savedUser.getRole());

        return userMapper.toUserResponse(savedUser);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        logger.info("Processing login request for email: {}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        logger.info("Successfully authenticated user: {}", user.getEmail());

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
