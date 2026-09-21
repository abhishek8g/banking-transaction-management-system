package com.banking.service;

import com.banking.dto.AccountResponse;
import com.banking.dto.BalanceResponse;
import com.banking.dto.CreateAccountRequest;
import com.banking.dto.UpdateAccountStatusRequest;
import com.banking.entity.AccountStatus;
import com.banking.entity.AccountType;
import com.banking.entity.BankAccount;
import com.banking.entity.Role;
import com.banking.entity.User;
import com.banking.exception.AccountNotFoundException;
import com.banking.exception.UnauthorizedTransactionException;
import com.banking.mapper.AccountMapper;
import com.banking.repository.BankAccountRepository;
import com.banking.repository.UserRepository;
import com.banking.service.impl.AccountServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private BankAccountRepository accountRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AccountMapper accountMapper;

    @InjectMocks
    private AccountServiceImpl accountService;

    private User userCustomer;
    private User userOther;
    private BankAccount account;
    private AccountResponse accountResponse;

    @BeforeEach
    void setUp() {
        userCustomer = User.builder()
                .id(1L)
                .name("John Customer")
                .email("customer@banking.com")
                .role(Role.CUSTOMER)
                .build();

        userOther = User.builder()
                .id(2L)
                .name("Other Customer")
                .email("other@banking.com")
                .role(Role.CUSTOMER)
                .build();

        account = BankAccount.builder()
                .id(100L)
                .accountNumber("1234567890")
                .balance(new BigDecimal("5000.00"))
                .accountType(AccountType.SAVINGS)
                .status(AccountStatus.ACTIVE)
                .user(userCustomer)
                .build();

        accountResponse = AccountResponse.builder()
                .id(100L)
                .accountNumber("1234567890")
                .balance(new BigDecimal("5000.00"))
                .accountType(AccountType.SAVINGS)
                .status(AccountStatus.ACTIVE)
                .userId(1L)
                .userEmail("customer@banking.com")
                .build();
    }

    @Test
    void createAccount_Success() {
        CreateAccountRequest request = CreateAccountRequest.builder()
                .accountType(AccountType.SAVINGS)
                .initialDeposit(new BigDecimal("1000.00"))
                .build();

        when(userRepository.findByEmail("customer@banking.com")).thenReturn(Optional.of(userCustomer));
        when(accountRepository.existsByAccountNumber(anyString())).thenReturn(false);
        when(accountRepository.save(any(BankAccount.class))).thenReturn(account);
        when(accountMapper.toAccountResponse(account)).thenReturn(accountResponse);

        AccountResponse result = accountService.createAccount(request, "customer@banking.com");

        assertNotNull(result);
        assertEquals("1234567890", result.getAccountNumber());
        verify(accountRepository, times(1)).save(any(BankAccount.class));
    }

    @Test
    void getAccountById_UnauthorizedUser_ThrowsException() {
        when(userRepository.findByEmail("other@banking.com")).thenReturn(Optional.of(userOther));
        when(accountRepository.findById(100L)).thenReturn(Optional.of(account));

        assertThrows(UnauthorizedTransactionException.class, () ->
                accountService.getAccountById(100L, "other@banking.com"));
    }

    @Test
    void updateAccountStatus_AdminSuccess() {
        UpdateAccountStatusRequest request = UpdateAccountStatusRequest.builder()
                .status(AccountStatus.BLOCKED)
                .build();

        when(accountRepository.findById(100L)).thenReturn(Optional.of(account));
        when(accountRepository.save(any(BankAccount.class))).thenReturn(account);
        when(accountMapper.toAccountResponse(account)).thenReturn(accountResponse);

        AccountResponse result = accountService.updateAccountStatus(100L, request);

        assertNotNull(result);
        verify(accountRepository, times(1)).save(account);
        assertEquals(AccountStatus.BLOCKED, account.getStatus());
    }
}
