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
public class WithdrawalRequest {

    @NotNull(message = "Account ID is required")
    private Long accountId;

    @NotNull(message = "Withdrawal amount is required")
    @DecimalMin(value = "0.01", message = "Withdrawal amount must be greater than 0")
    private BigDecimal amount;
}
