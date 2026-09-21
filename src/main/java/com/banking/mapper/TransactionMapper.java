package com.banking.mapper;

import com.banking.dto.TransactionResponse;
import com.banking.entity.Transaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {

    public TransactionResponse toTransactionResponse(Transaction transaction) {
        if (transaction == null) {
            return null;
        }
        return TransactionResponse.builder()
                .id(transaction.getId())
                .transactionReference(transaction.getTransactionReference())
                .sourceAccountId(transaction.getSourceAccount() != null ? transaction.getSourceAccount().getId() : null)
                .sourceAccountNumber(transaction.getSourceAccount() != null ? transaction.getSourceAccount().getAccountNumber() : null)
                .destinationAccountId(transaction.getDestinationAccount() != null ? transaction.getDestinationAccount().getId() : null)
                .destinationAccountNumber(transaction.getDestinationAccount() != null ? transaction.getDestinationAccount().getAccountNumber() : null)
                .amount(transaction.getAmount())
                .transactionType(transaction.getTransactionType())
                .status(transaction.getStatus())
                .description(transaction.getDescription())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
