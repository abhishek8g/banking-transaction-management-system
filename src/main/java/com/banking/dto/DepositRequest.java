package com.banking.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepositRequest {

    @NotNull(message = "Account ID is required")
    private Long accountId;

    @NotNull(message = "Deposit amount is required")
    @DecimalMin(value = "0.01", message = "Deposit amount must be greater than 0")
    private BigDecimal amount;
}
