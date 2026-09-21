package com.banking.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BalanceResponse {

    private Long accountId;
    private String accountNumber;
    private BigDecimal balance;
    @Builder.Default
    private String currency = "INR";
}
