package com.banking.service.impl;

import com.banking.dto.*;
import com.banking.entity.*;
import com.banking.exception.*;
import com.banking.mapper.TransactionMapper;
import com.banking.repository.BankAccountRepository;
import com.banking.repository.TransactionRepository;
import com.banking.repository.UserRepository;
import com.banking.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionServiceImpl.class);

    private final BankAccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final TransactionMapper transactionMapper;

    @Override
    @Transactional
    public TransactionResponse deposit(DepositRequest request, String currentUserEmail) {
        logger.info("Initiating deposit of {} to account ID {}", request.getAmount(), request.getAccountId());

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Deposit amount must be greater than zero");
        }

        // Lock target account pessimistically
        BankAccount account = accountRepository.findByIdWithLock(request.getAccountId())
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + request.getAccountId()));

        validateAccountActive(account);
        verifyAccountOwnershipOrAdmin(account, currentUserEmail);

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .transactionReference(generateReference())
                .destinationAccount(account)
                .amount(request.getAmount())
                .transactionType(TransactionType.DEPOSIT)
                .status(TransactionStatus.SUCCESS)
                .description("Deposit to account " + account.getAccountNumber())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        logger.info("Deposit successful. Reference: {}", savedTransaction.getTransactionReference());

        return transactionMapper.toTransactionResponse(savedTransaction);
    }

    @Override
    @Transactional
    public TransactionResponse withdraw(WithdrawalRequest request, String currentUserEmail) {
        logger.info("Initiating withdrawal of {} from account ID {}", request.getAmount(), request.getAccountId());

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Withdrawal amount must be greater than zero");
        }

        // Lock target account pessimistically to prevent race conditions and negative balances
        BankAccount account = accountRepository.findByIdWithLock(request.getAccountId())
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + request.getAccountId()));

        validateAccountActive(account);
        verifyAccountOwnershipOrAdmin(account, currentUserEmail);

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            logger.warn("Withdrawal failed for account ID {}: Insufficient balance (Available: {}, Requested: {})",
                    request.getAccountId(), account.getBalance(), request.getAmount());
            throw new InsufficientBalanceException(
                    String.format("Insufficient balance. Available: %s, Requested: %s", account.getBalance(), request.getAmount()));
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .transactionReference(generateReference())
                .sourceAccount(account)
                .amount(request.getAmount())
                .transactionType(TransactionType.WITHDRAWAL)
                .status(TransactionStatus.SUCCESS)
                .description("Withdrawal from account " + account.getAccountNumber())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        logger.info("Withdrawal successful. Reference: {}", savedTransaction.getTransactionReference());

        return transactionMapper.toTransactionResponse(savedTransaction);
    }

    @Override
    @Transactional
    public TransactionResponse transfer(TransferRequest request, String currentUserEmail) {
        logger.info("Initiating transfer of {} from account ID {} to account ID {}",
                request.getAmount(), request.getSourceAccountId(), request.getDestinationAccountId());

        if (request.getSourceAccountId().equals(request.getDestinationAccountId())) {
            throw new InvalidTransactionException("Source and destination accounts cannot be identical");
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Transfer amount must be greater than zero");
        }

        // Deterministic Lock Acquisition Strategy: Lock lower ID first to prevent deadlocks
        Long firstLockId = Math.min(request.getSourceAccountId(), request.getDestinationAccountId());
        Long secondLockId = Math.max(request.getSourceAccountId(), request.getDestinationAccountId());

        BankAccount firstAccount = accountRepository.findByIdWithLock(firstLockId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + firstLockId));
        BankAccount secondAccount = accountRepository.findByIdWithLock(secondLockId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + secondLockId));

        BankAccount sourceAccount = firstLockId.equals(request.getSourceAccountId()) ? firstAccount : secondAccount;
        BankAccount destinationAccount = firstLockId.equals(request.getSourceAccountId()) ? secondAccount : firstAccount;

        validateAccountActive(sourceAccount);
        validateAccountActive(destinationAccount);
        verifyAccountOwnershipOrAdmin(sourceAccount, currentUserEmail);

        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            logger.warn("Transfer failed: Insufficient balance in source account ID {}", sourceAccount.getId());
            throw new InsufficientBalanceException(
                    String.format("Insufficient balance. Available: %s, Requested: %s", sourceAccount.getBalance(), request.getAmount()));
        }

        // Atomic balance updates
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
        destinationAccount.setBalance(destinationAccount.getBalance().add(request.getAmount()));

        accountRepository.save(sourceAccount);
        accountRepository.save(destinationAccount);

        String desc = request.getDescription() != null && !request.getDescription().isBlank() ?
                request.getDescription() : "Transfer from " + sourceAccount.getAccountNumber() + " to " + destinationAccount.getAccountNumber();

        Transaction transaction = Transaction.builder()
                .transactionReference(generateReference())
                .sourceAccount(sourceAccount)
                .destinationAccount(destinationAccount)
                .amount(request.getAmount())
                .transactionType(TransactionType.TRANSFER)
                .status(TransactionStatus.SUCCESS)
                .description(desc)
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        logger.info("Transfer successful. Reference: {}", savedTransaction.getTransactionReference());

        return transactionMapper.toTransactionResponse(savedTransaction);
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionResponse getTransactionByReference(String reference, String currentUserEmail) {
        Transaction transaction = transactionRepository.findByTransactionReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with reference: " + reference));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserEmail));

        if (currentUser.getRole() != Role.ADMIN) {
            boolean isSourceOwner = transaction.getSourceAccount() != null && transaction.getSourceAccount().getUser().getId().equals(currentUser.getId());
            boolean isDestOwner = transaction.getDestinationAccount() != null && transaction.getDestinationAccount().getUser().getId().equals(currentUser.getId());
            if (!isSourceOwner && !isDestOwner) {
                throw new UnauthorizedTransactionException("Access denied: You are not authorized to view this transaction");
            }
        }

        return transactionMapper.toTransactionResponse(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<TransactionResponse> getTransactionHistory(Long accountId, String currentUserEmail, int page, int size, String sortBy, String sortDir) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserEmail));

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Transaction> transactions;

        if (accountId != null) {
            BankAccount account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + accountId));

            if (currentUser.getRole() != Role.ADMIN && !account.getUser().getId().equals(currentUser.getId())) {
                throw new UnauthorizedTransactionException("Access denied: You cannot view transaction history for account ID " + accountId);
            }
            transactions = transactionRepository.findByAccountId(accountId, pageable);
        } else {
            if (currentUser.getRole() == Role.ADMIN) {
                transactions = transactionRepository.findAll(pageable);
            } else {
                transactions = transactionRepository.findByUserId(currentUser.getId(), pageable);
            }
        }

        List<TransactionResponse> content = transactions.getContent().stream()
                .map(transactionMapper::toTransactionResponse)
                .toList();

        return PagedResponse.<TransactionResponse>builder()
                .content(content)
                .pageNo(transactions.getNumber())
                .pageSize(transactions.getSize())
                .totalElements(transactions.getTotalElements())
                .totalPages(transactions.getTotalPages())
                .last(transactions.isLast())
                .build();
    }

    private void validateAccountActive(BankAccount account) {
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountBlockedException("Transaction rejected: Account " + account.getAccountNumber() + " is " + account.getStatus());
        }
    }

    private void verifyAccountOwnershipOrAdmin(BankAccount account, String currentUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserEmail));

        if (currentUser.getRole() != Role.ADMIN && !account.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedTransactionException("Access denied: You do not have permission to execute transactions on account " + account.getAccountNumber());
        }
    }

    private String generateReference() {
        return "TXN-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
}
