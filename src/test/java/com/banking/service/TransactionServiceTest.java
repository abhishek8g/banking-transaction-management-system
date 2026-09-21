package com.banking.service;

import com.banking.dto.DepositRequest;
import com.banking.dto.TransactionResponse;
import com.banking.dto.TransferRequest;
import com.banking.dto.WithdrawalRequest;
import com.banking.entity.*;
import com.banking.exception.AccountBlockedException;
import com.banking.exception.InsufficientBalanceException;
import com.banking.exception.InvalidTransactionException;
import com.banking.mapper.TransactionMapper;
import com.banking.repository.BankAccountRepository;
import com.banking.repository.TransactionRepository;
import com.banking.repository.UserRepository;
import com.banking.service.impl.TransactionServiceImpl;
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
class TransactionServiceTest {

    @Mock
    private BankAccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TransactionMapper transactionMapper;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    private User user;
    private BankAccount sourceAccount;
    private BankAccount destinationAccount;
    private Transaction transaction;
    private TransactionResponse transactionResponse;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .name("Alice")
                .email("alice@banking.com")
                .role(Role.CUSTOMER)
                .build();

        sourceAccount = BankAccount.builder()
                .id(1L)
                .accountNumber("ACC-1001")
                .balance(new BigDecimal("10000.00"))
                .accountType(AccountType.SAVINGS)
                .status(AccountStatus.ACTIVE)
                .user(user)
                .build();

        destinationAccount = BankAccount.builder()
                .id(2L)
                .accountNumber("ACC-1002")
                .balance(new BigDecimal("2000.00"))
                .accountType(AccountType.CURRENT)
                .status(AccountStatus.ACTIVE)
                .user(user)
                .build();

        transaction = Transaction.builder()
                .id(50L)
                .transactionReference("TXN-1234567890")
                .sourceAccount(sourceAccount)
                .amount(new BigDecimal("1000.00"))
                .transactionType(TransactionType.WITHDRAWAL)
                .status(TransactionStatus.SUCCESS)
                .build();

        transactionResponse = TransactionResponse.builder()
                .id(50L)
                .transactionReference("TXN-1234567890")
                .amount(new BigDecimal("1000.00"))
                .transactionType(TransactionType.WITHDRAWAL)
                .status(TransactionStatus.SUCCESS)
                .build();
    }

    @Test
    void deposit_Success() {
        DepositRequest request = DepositRequest.builder()
                .accountId(1L)
                .amount(new BigDecimal("5000.00"))
                .build();

        when(accountRepository.findByIdWithLock(1L)).thenReturn(Optional.of(sourceAccount));
        when(userRepository.findByEmail("alice@banking.com")).thenReturn(Optional.of(user));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);
        when(transactionMapper.toTransactionResponse(any())).thenReturn(transactionResponse);

        TransactionResponse response = transactionService.deposit(request, "alice@banking.com");

        assertNotNull(response);
        assertEquals(new BigDecimal("15000.00"), sourceAccount.getBalance());
        verify(accountRepository, times(1)).save(sourceAccount);
    }

    @Test
    void withdraw_Success() {
        WithdrawalRequest request = WithdrawalRequest.builder()
                .accountId(1L)
                .amount(new BigDecimal("3000.00"))
                .build();

        when(accountRepository.findByIdWithLock(1L)).thenReturn(Optional.of(sourceAccount));
        when(userRepository.findByEmail("alice@banking.com")).thenReturn(Optional.of(user));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);
        when(transactionMapper.toTransactionResponse(any())).thenReturn(transactionResponse);

        TransactionResponse response = transactionService.withdraw(request, "alice@banking.com");

        assertNotNull(response);
        assertEquals(new BigDecimal("7000.00"), sourceAccount.getBalance());
        verify(accountRepository, times(1)).save(sourceAccount);
    }

    @Test
    void withdraw_InsufficientBalance_ThrowsException() {
        WithdrawalRequest request = WithdrawalRequest.builder()
                .accountId(1L)
                .amount(new BigDecimal("15000.00"))
                .build();

        when(accountRepository.findByIdWithLock(1L)).thenReturn(Optional.of(sourceAccount));
        when(userRepository.findByEmail("alice@banking.com")).thenReturn(Optional.of(user));

        assertThrows(InsufficientBalanceException.class, () ->
                transactionService.withdraw(request, "alice@banking.com"));

        assertEquals(new BigDecimal("10000.00"), sourceAccount.getBalance());
    }

    @Test
    void transfer_Success() {
        TransferRequest request = TransferRequest.builder()
                .sourceAccountId(1L)
                .destinationAccountId(2L)
                .amount(new BigDecimal("1500.00"))
                .description("Rent Payment")
                .build();

        when(accountRepository.findByIdWithLock(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findByIdWithLock(2L)).thenReturn(Optional.of(destinationAccount));
        when(userRepository.findByEmail("alice@banking.com")).thenReturn(Optional.of(user));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);
        when(transactionMapper.toTransactionResponse(any())).thenReturn(transactionResponse);

        TransactionResponse response = transactionService.transfer(request, "alice@banking.com");

        assertNotNull(response);
        assertEquals(new BigDecimal("8500.00"), sourceAccount.getBalance());
        assertEquals(new BigDecimal("3500.00"), destinationAccount.getBalance());
    }

    @Test
    void transfer_SameSourceAndDestination_ThrowsException() {
        TransferRequest request = TransferRequest.builder()
                .sourceAccountId(1L)
                .destinationAccountId(1L)
                .amount(new BigDecimal("500.00"))
                .build();

        assertThrows(InvalidTransactionException.class, () ->
                transactionService.transfer(request, "alice@banking.com"));
    }

    @Test
    void transfer_BlockedAccount_ThrowsException() {
        sourceAccount.setStatus(AccountStatus.BLOCKED);

        TransferRequest request = TransferRequest.builder()
                .sourceAccountId(1L)
                .destinationAccountId(2L)
                .amount(new BigDecimal("500.00"))
                .build();

        when(accountRepository.findByIdWithLock(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findByIdWithLock(2L)).thenReturn(Optional.of(destinationAccount));

        assertThrows(AccountBlockedException.class, () ->
                transactionService.transfer(request, "alice@banking.com"));
    }
}
