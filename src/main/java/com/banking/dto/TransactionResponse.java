package com.banking.dto;

import com.banking.entity.TransactionStatus;
import com.banking.entity.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private Long id;
    private String transactionReference;
    private Long sourceAccountId;
    private String sourceAccountNumber;
    private Long destinationAccountId;
    private String destinationAccountNumber;
    private BigDecimal amount;
    private TransactionType transactionType;
    private TransactionStatus status;
    private String description;
    private LocalDateTime createdAt;
}
