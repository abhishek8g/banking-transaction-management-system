package com.banking.service.impl;

import com.banking.dto.PagedResponse;
import com.banking.dto.UserResponse;
import com.banking.entity.User;
import com.banking.exception.ResourceNotFoundException;
import com.banking.mapper.UserMapper;
import com.banking.repository.UserRepository;
import com.banking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getAllUsers(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<User> users = userRepository.findAll(pageable);

        List<UserResponse> content = users.getContent().stream()
                .map(userMapper::toUserResponse)
                .toList();

        return PagedResponse.<UserResponse>builder()
                .content(content)
                .pageNo(users.getNumber())
                .pageSize(users.getSize())
                .totalElements(users.getTotalElements())
                .totalPages(users.getTotalPages())
                .last(users.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return userMapper.toUserResponse(user);
    }
}
