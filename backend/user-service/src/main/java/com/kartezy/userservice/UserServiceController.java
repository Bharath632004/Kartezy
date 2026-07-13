package com.kartezy.userservice;

import com.kartezy.authservice.dto.UserDto;
import com.kartezy.authservice.entity.User;
import com.kartezy.authservice.entity.UserStatus;
import com.kartezy.authservice.repository.UserRepository;
import com.kartezy.userservice.dto.AddressDto;
import com.kartezy.userservice.dto.LoginHistoryDto;
import com.kartezy.userservice.dto.OrderDto;
import com.kartezy.userservice.dto.WalletReferenceDto;
import com.kartezy.userservice.dto.WalletTransactionDto;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserServiceController {

    private final UserRepository userRepository;

    public UserServiceController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getList(@RequestParam Map<String, String> params) {
        // In a real implementation, this would support filtering, pagination, etc.
        Iterable<User> users = userRepository.findAll();
        List<UserDto> userDtos = new ArrayList<>();
        for (User user : users) {
            userDtos.add(UserDto.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .phoneNumber(user.getPhoneNumber())
                    .emailVerified(user.isEmailVerified())
                    .phoneVerified(user.isPhoneVerified())
                    .build());
        }
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getDetail(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(user -> UserDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .phoneNumber(user.getPhoneNumber())
                        .emailVerified(user.isEmailVerified())
                        .phoneVerified(user.isPhoneVerified())
                        .build())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<?> blockUser(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setStatus(UserStatus.LOCKED);
                    userRepository.save(user);
                    return ResponseEntity.ok("User blocked successfully");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/unblock")
    public ResponseEntity<?> unblockUser(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(user -> {
                    // If user was locked, set to active; otherwise, keep current status
                    if (user.getStatus() == UserStatus.LOCKED) {
                        user.setStatus(UserStatus.ACTIVE);
                    }
                    // In a more complex system, you might want to restore the previous status
                    userRepository.save(user);
                    return ResponseEntity.ok("User unblocked successfully");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(user -> {
                    // In a real system, you might want to soft-delete or check for dependencies
                    userRepository.delete(user);
                    return ResponseEntity.ok("User deleted successfully");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/wallet")
    public ResponseEntity<WalletReferenceDto> getWallet(@PathVariable UUID id) {
        WalletReferenceDto wallet = WalletReferenceDto.builder()
                .id(UUID.randomUUID())
                .customerProfileId(UUID.randomUUID()) // In real app, link to customer profile
                .walletId("wallet_001")
                .walletType("WALLET")
                .isPrimary(true)
                .isVerified(true)
                .build();
        return ResponseEntity.ok(wallet);
    }

    @GetMapping("/{id}/wallet/transactions")
    public ResponseEntity<List<WalletTransactionDto>> getWalletTransactions(@PathVariable UUID id) {
        // Return empty list for now - in a real implementation, this would fetch actual transactions
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<List<OrderDto>> getOrders(@PathVariable UUID id) {
        // Return list of order DTOs
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/{id}/login-history")
    public ResponseEntity<List<LoginHistoryDto>> getLoginHistory(@PathVariable UUID id) {
        LoginHistoryDto lh = LoginHistoryDto.builder()
                .id(UUID.randomUUID())
                .userId(id)
                .loginTime(new Date().toInstant())
                .ipAddress("192.168.1.1")
                .userAgent("Mozilla/5.0")
                .success(true)
                .build();
        return ResponseEntity.ok(Collections.singletonList(lh));
    }

    @GetMapping("/{id}/addresses")
    public ResponseEntity<List<AddressDto>> getAddresses(@PathVariable UUID id) {
        AddressDto addr = AddressDto.builder()
                .id(UUID.randomUUID())
                .userId(id)
                .type("HOME")
                .street("123 Main St")
                .city("Anytown")
                .state("NY")
                .postalCode("12345")
                .country("USA")
                .isDefault(true)
                .build();
        return ResponseEntity.ok(Collections.singletonList(addr));
    }
}