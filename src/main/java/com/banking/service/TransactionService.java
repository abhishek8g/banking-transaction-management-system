package com.banking.service;

import com.banking.dto.*;

public interface TransactionService {

    TransactionResponse deposit(DepositRequest request, String currentUserEmail);

    TransactionResponse withdraw(WithdrawalRequest request, String currentUserEmail);

    TransactionResponse transfer(TransferRequest request, String currentUserEmail);

    TransactionResponse getTransactionByReference(String reference, String currentUserEmail);

    PagedResponse<TransactionResponse> getTransactionHistory(Long accountId, String currentUserEmail, int page, int size, String sortBy, String sortDir);
}
