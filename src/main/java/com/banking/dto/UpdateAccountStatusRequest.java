package com.banking.dto;

import com.banking.entity.AccountStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateAccountStatusRequest {

    @NotNull(message = "Account status is required")
    private AccountStatus status;
}
