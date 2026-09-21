package com.banking.dto;

import com.banking.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private String email;
    private Role role;
}
