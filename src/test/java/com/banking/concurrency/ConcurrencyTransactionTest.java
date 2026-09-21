package com.banking.concurrency;

import com.banking.dto.WithdrawalRequest;
import com.banking.entity.AccountStatus;
import com.banking.entity.AccountType;
import com.banking.entity.BankAccount;
import com.banking.entity.Role;
import com.banking.entity.User;
import com.banking.exception.InsufficientBalanceException;
import com.banking.repository.BankAccountRepository;
import com.banking.repository.UserRepository;
import com.banking.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class ConcurrencyTransactionTest {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private BankAccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    private BankAccount testAccount;

    @BeforeEach
    void setUp() {
        accountRepository.deleteAll();
        userRepository.deleteAll();

        testUser = User.builder()
                .name("Concurrent User")
                .email("concurrent@banking.com")
                .password("password")
                .role(Role.CUSTOMER)
                .build();
        userRepository.save(testUser);

        testAccount = BankAccount.builder()
                .accountNumber("ACC-CONCUR-01")
                .balance(new BigDecimal("10000.00"))
                .accountType(AccountType.SAVINGS)
                .status(AccountStatus.ACTIVE)
                .user(testUser)
                .build();
        accountRepository.save(testAccount);
    }

    @Test
    void concurrentWithdrawals_ShouldMaintainBalanceIntegrityAndPreventNegativeBalance() throws InterruptedException {
        int numberOfThreads = 10;
        BigDecimal withdrawalAmount = new BigDecimal("1500.00"); // 10 * 1500 = 15,000 (Initial balance is 10,000)

        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(numberOfThreads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        for (int i = 0; i < numberOfThreads; i++) {
            executorService.execute(() -> {
                try {
                    latch.await(); // Wait for signal to start all threads simultaneously
                    WithdrawalRequest request = WithdrawalRequest.builder()
                            .accountId(testAccount.getId())
                            .amount(withdrawalAmount)
                            .build();

                    transactionService.withdraw(request, testUser.getEmail());
                    successCount.incrementAndGet();
                } catch (InsufficientBalanceException e) {
                    failureCount.incrementAndGet();
                } catch (Exception e) {
                    e.printStackTrace();
                    failureCount.incrementAndGet();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        // Trigger simultaneous execution
        latch.countDown();
        boolean completed = doneLatch.await(10, TimeUnit.SECONDS);
        executorService.shutdown();

        assertTrue(completed, "All concurrent tasks should complete within timeout");

        // Verify database state after concurrent operations
        BankAccount finalAccount = accountRepository.findById(testAccount.getId()).orElseThrow();

        // Initial balance = 10,000. Each withdrawal = 1,500. Max successful = 6 (9,000 total). Final balance = 1,000.
        assertEquals(6, successCount.get(), "Exactly 6 withdrawals should succeed");
        assertEquals(4, failureCount.get(), "Exactly 4 withdrawals should fail due to insufficient funds");
        assertEquals(new BigDecimal("1000.00"), finalAccount.getBalance(), "Final account balance must equal 1000.00");
        assertTrue(finalAccount.getBalance().compareTo(BigDecimal.ZERO) >= 0, "Account balance must never be negative");
    }
}
