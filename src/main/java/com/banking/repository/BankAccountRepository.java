package com.banking.repository;

import com.banking.entity.BankAccount;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {

    Optional<BankAccount> findByAccountNumber(String accountNumber);

    List<BankAccount> findByUserId(Long userId);

    Page<BankAccount> findByUserId(Long userId, Pageable pageable);

    boolean existsByAccountNumber(String accountNumber);

    /**
     * Acquires a Pessimistic Write Lock on the bank account by ID.
     * Prevents dirty reads, non-repeatable reads, and concurrent updates during transactions.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM BankAccount a WHERE a.id = :id")
    Optional<BankAccount> findByIdWithLock(@Param("id") Long id);

    /**
     * Acquires a Pessimistic Write Lock on the bank account by account number.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM BankAccount a WHERE a.accountNumber = :accountNumber")
    Optional<BankAccount> findByAccountNumberWithLock(@Param("accountNumber") String accountNumber);
}
