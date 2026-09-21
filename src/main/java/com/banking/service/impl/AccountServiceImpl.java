package com.banking.service.impl;

import com.banking.dto.*;
import com.banking.entity.AccountStatus;
import com.banking.entity.BankAccount;
import com.banking.entity.Role;
import com.banking.entity.User;
import com.banking.exception.AccountNotFoundException;
import com.banking.exception.ResourceNotFoundException;
import com.banking.exception.UnauthorizedTransactionException;
import com.banking.mapper.AccountMapper;
import com.banking.repository.BankAccountRepository;
import com.banking.repository.UserRepository;
import com.banking.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private static final Logger logger = LoggerFactory.getLogger(AccountServiceImpl.class);
    private static final SecureRandom random = new SecureRandom();

    private final BankAccountRepository accountRepository;
    private final UserRepository userRepository;
    private final AccountMapper accountMapper;

    @Override
    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request, String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserEmail));

        String accountNumber = generateUniqueAccountNumber();

        BankAccount account = BankAccount.builder()
                .accountNumber(accountNumber)
                .balance(request.getInitialDeposit())
                .accountType(request.getAccountType())
                .status(AccountStatus.ACTIVE)
                .user(user)
                .build();

        BankAccount savedAccount = accountRepository.save(account);
        logger.info("Successfully created account {} for user {}", savedAccount.getAccountNumber(), currentUserEmail);

        return accountMapper.toAccountResponse(savedAccount);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AccountResponse> getAccounts(String currentUserEmail, int page, int size, String sortBy, String sortDir) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserEmail));

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<BankAccount> accounts;
        if (currentUser.getRole() == Role.ADMIN) {
            accounts = accountRepository.findAll(pageable);
        } else {
            accounts = accountRepository.findByUserId(currentUser.getId(), pageable);
        }

        List<AccountResponse> content = accounts.getContent().stream()
                .map(accountMapper::toAccountResponse)
                .toList();

        return PagedResponse.<AccountResponse>builder()
                .content(content)
                .pageNo(accounts.getNumber())
                .pageSize(accounts.getSize())
                .totalElements(accounts.getTotalElements())
                .totalPages(accounts.getTotalPages())
                .last(accounts.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getAccountById(Long id, String currentUserEmail) {
        BankAccount account = findAccountAndVerifyOwnership(id, currentUserEmail);
        return accountMapper.toAccountResponse(account);
    }

    @Override
    @Transactional(readOnly = true)
    public BalanceResponse getBalance(Long id, String currentUserEmail) {
        BankAccount account = findAccountAndVerifyOwnership(id, currentUserEmail);
        return accountMapper.toBalanceResponse(account);
    }

    @Override
    @Transactional
    public AccountResponse updateAccountStatus(Long id, UpdateAccountStatusRequest request) {
        BankAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + id));

        account.setStatus(request.getStatus());
        BankAccount updatedAccount = accountRepository.save(account);
        logger.info("Updated account {} status to {}", id, request.getStatus());

        return accountMapper.toAccountResponse(updatedAccount);
    }

    @Override
    @Transactional
    public void deleteAccount(Long id) {
        BankAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + id));

        account.setStatus(AccountStatus.CLOSED);
        accountRepository.save(account);
        logger.info("Closed account with ID: {}", id);
    }

    private BankAccount findAccountAndVerifyOwnership(Long id, String currentUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserEmail));

        BankAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + id));

        if (currentUser.getRole() != Role.ADMIN && !account.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedTransactionException("Access denied: You do not own account ID " + id);
        }

        return account;
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            long number = 1000000000L + (long) (random.nextDouble() * 9000000000L);
            accountNumber = String.valueOf(number);
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
}
