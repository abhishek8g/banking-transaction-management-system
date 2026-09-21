package com.banking.service;

import com.banking.dto.PagedResponse;
import com.banking.dto.UserResponse;

public interface UserService {

    PagedResponse<UserResponse> getAllUsers(int page, int size, String sortBy, String sortDir);

    UserResponse getUserById(Long id);
}
