package com.banking.controller;

import com.banking.dto.*;
import com.banking.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transaction Processing", description = "Endpoints for Deposit, Withdrawal, Transfer, and Transaction History")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/deposit")
    @Operation(summary = "Deposit funds", description = "Deposits money into the specified bank account.")
    public ResponseEntity<TransactionResponse> deposit(
            @Valid @RequestBody DepositRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TransactionResponse response = transactionService.deposit(request, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/withdraw")
    @Operation(summary = "Withdraw funds", description = "Withdraws money from the specified account after verifying sufficient balance.")
    public ResponseEntity<TransactionResponse> withdraw(
            @Valid @RequestBody WithdrawalRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TransactionResponse response = transactionService.withdraw(request, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/transfer")
    @Operation(summary = "Account-to-Account Transfer", description = "Transfers funds atomically between two bank accounts.")
    public ResponseEntity<TransactionResponse> transfer(
            @Valid @RequestBody TransferRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TransactionResponse response = transactionService.transfer(request, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{reference}")
    @Operation(summary = "Get transaction by reference", description = "Retrieves transaction details using unique transaction reference string.")
    public ResponseEntity<TransactionResponse> getTransactionByReference(
            @PathVariable String reference,
            @AuthenticationPrincipal UserDetails userDetails) {
        TransactionResponse response = transactionService.getTransactionByReference(reference, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get transaction history", description = "Fetches paginated transaction history. Optionally filter by accountId.")
    public ResponseEntity<PagedResponse<TransactionResponse>> getTransactionHistory(
            @RequestParam(required = false) Long accountId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<TransactionResponse> response = transactionService.getTransactionHistory(
                accountId, userDetails.getUsername(), page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }
}
