package com.banking.mapper;

import com.banking.dto.AccountResponse;
import com.banking.dto.BalanceResponse;
import com.banking.entity.BankAccount;
import org.springframework.stereotype.Component;

@Component
public class AccountMapper {

    public AccountResponse toAccountResponse(BankAccount account) {
        if (account == null) {
            return null;
        }
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .balance(account.getBalance())
                .accountType(account.getAccountType())
                .status(account.getStatus())
                .userId(account.getUser() != null ? account.getUser().getId() : null)
                .userEmail(account.getUser() != null ? account.getUser().getEmail() : null)
                .createdAt(account.getCreatedAt())
                .build();
    }

    public BalanceResponse toBalanceResponse(BankAccount account) {
        if (account == null) {
            return null;
        }
        return BalanceResponse.builder()
                .accountId(account.getId())
                .accountNumber(account.getAccountNumber())
                .balance(account.getBalance())
                .currency("INR")
                .build();
    }
}
