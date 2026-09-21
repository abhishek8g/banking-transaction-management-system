package com.banking.service;

import com.banking.dto.*;

public interface AccountService {

    AccountResponse createAccount(CreateAccountRequest request, String currentUserEmail);

    PagedResponse<AccountResponse> getAccounts(String currentUserEmail, int page, int size, String sortBy, String sortDir);

    AccountResponse getAccountById(Long id, String currentUserEmail);

    BalanceResponse getBalance(Long id, String currentUserEmail);

    AccountResponse updateAccountStatus(Long id, UpdateAccountStatusRequest request);

    void deleteAccount(Long id);
}
