package com.banking.controller;

import com.banking.dto.*;
import com.banking.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@Tag(name = "Bank Account Management", description = "Endpoints for bank account creation, retrieval, balance check, and status management")
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    @Operation(summary = "Create a new bank account", description = "Creates a new bank account for the authenticated user.")
    public ResponseEntity<AccountResponse> createAccount(
            @Valid @RequestBody CreateAccountRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        AccountResponse response = accountService.createAccount(request, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "List accounts", description = "Retrieves accounts. Customers view their own accounts; Admins can view all accounts.")
    public ResponseEntity<PagedResponse<AccountResponse>> getAccounts(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<AccountResponse> response = accountService.getAccounts(userDetails.getUsername(), page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get account details", description = "Fetches account details by account ID.")
    public ResponseEntity<AccountResponse> getAccountById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        AccountResponse response = accountService.getAccountById(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/balance")
    @Operation(summary = "Check account balance", description = "Retrieves current balance for the specified account ID.")
    public ResponseEntity<BalanceResponse> getBalance(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        BalanceResponse response = accountService.getBalance(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update account status (Admin)", description = "Allows admins to update status (e.g. ACTIVE, BLOCKED, CLOSED).")
    public ResponseEntity<AccountResponse> updateAccountStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAccountStatusRequest request) {
        AccountResponse response = accountService.updateAccountStatus(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Close bank account (Admin)", description = "Sets account status to CLOSED.")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}
