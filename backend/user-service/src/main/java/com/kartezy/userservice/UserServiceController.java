package com.kartezy.userservice;

import com.kartezy.authservice.dto.UserDto;
import com.kartezy.authservice.entity.User;
import com.kartezy.authservice.entity.UserStatus;
import com.kartezy.authservice.repository.UserRepository;
import com.kartezy.userservice.dto.AddressDto;
import com.kartezy.userservice.dto.CustomerProfileDto;
import com.kartezy.userservice.dto.FavoriteProductDto;
import com.kartezy.userservice.dto.LoginHistoryDto;
import com.kartezy.userservice.dto.OrderDto;
import com.kartezy.userservice.dto.SearchHistoryDto;
import com.kartezy.userservice.dto.WalletReferenceDto;
import com.kartezy.userservice.dto.WalletTransactionDto;
import com.kartezy.userservice.dto.WishlistItemDto;
import com.kartezy.userservice.entity.CustomerProfile;
import com.kartezy.userservice.entity.FavoriteProduct;
import com.kartezy.userservice.entity.SearchHistory;
import com.kartezy.userservice.entity.Wishlist;
import com.kartezy.userservice.entity.Address;
import com.kartezy.userservice.entity.WishlistItem;
import com.kartezy.userservice.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;
@PreAuthorize("isAuthenticated()")
@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserServiceController {
    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final FavoriteProductRepository favoriteProductRepository;
    private final SearchHistoryRepository searchHistoryRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final AddressRepository addressRepository;
    private final WalletReferenceRepository walletReferenceRepository;
    @GetMapping
    public ResponseEntity<List<UserDto>> getList(@RequestParam Map<String, String> params) {
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
    @Transactional
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
    @Transactional
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
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok("User deleted successfully");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/{id}/wallet")
    public ResponseEntity<?> getWallet(@PathVariable UUID id) {
        return customerProfileRepository.findByUserId(id)
                .flatMap(cp -> walletReferenceRepository.findByCustomerProfileId(cp.getId()))
                .map(wr -> ResponseEntity.ok((Object) WalletReferenceDto.builder()
                        .id(wr.getId())
                        .customerProfileId(wr.getCustomerProfile().getId())
                        .walletId(wr.getWalletId())
                        .walletType(wr.getWalletType())
                        .isPrimary(wr.isPrimary())
                        .isVerified(wr.isVerified())
                        .build()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/{id}/wallet/transactions")
    public ResponseEntity<List<WalletTransactionDto>> getWalletTransactions(@PathVariable UUID id) {
        return ResponseEntity.ok(Collections.emptyList());
    }
    @GetMapping("/{id}/orders")
    public ResponseEntity<List<OrderDto>> getOrders(@PathVariable UUID id) {
        return ResponseEntity.ok(Collections.emptyList());
    }
    @GetMapping("/{id}/login-history")
    public ResponseEntity<List<LoginHistoryDto>> getLoginHistory(@PathVariable UUID id) {
        // Return empty list - login history is tracked by auth-service
        return ResponseEntity.ok(Collections.emptyList());
    }
    @GetMapping("/{id}/addresses")
    public ResponseEntity<List<AddressDto>> getAddresses(@PathVariable UUID id) {
        return customerProfileRepository.findByUserId(id)
                .map(cp -> {
                    List<Address> addresses = addressRepository.findByCustomerProfileId(cp.getId());
                    List<AddressDto> dtos = addresses.stream()
                            .map(addr -> AddressDto.builder()
                                    .id(addr.getId())
                                    .customerProfileId(cp.getId())
                                    .type(addr.getType() != null ? AddressDto.AddressType.valueOf(addr.getType().name()) : AddressDto.AddressType.HOME)
                                    .street(addr.getStreet())
                                    .city(addr.getCity())
                                    .state(addr.getState())
                                    .postalCode(addr.getPostalCode())
                                    .country(addr.getCountry())
                                    .defaultAddress(addr.isDefaultAddress())
                                    .build())
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(dtos);
                })
                .orElseGet(() -> ResponseEntity.ok(Collections.emptyList()));
    }
    // New endpoints for recommendation service
    @GetMapping("/{id}/wishlist")
    public ResponseEntity<List<WishlistItemDto>> getWishlist(@PathVariable UUID id) {
        // Get customer profile by userId
        Optional<CustomerProfile> optionalCp = customerProfileRepository.findByUserId(id);
        if (optionalCp.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        CustomerProfile cp = optionalCp.get();
        // Get wishlist for this customer profile (assuming one wishlist per user)
        List<Wishlist> wishlists = wishlistRepository.findByCustomerProfileId(cp.getId());
        if (wishlists.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        // Take the first wishlist (or we could merge all)
        Wishlist wishlist = wishlists.get(0);
        // Get wishlist items
        List<WishlistItem> wishlistItems = wishlistItemRepository.findByWishlistId(wishlist.getId());
        List<WishlistItemDto> dtos = wishlistItems.stream()
                .map(item -> WishlistItemDto.builder()
                        .id(item.getId())
                        .wishlistId(item.getWishlist().getId())
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .productImageUrl(item.getProductImageUrl())
                        .addedAt(item.getAddedAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    @GetMapping("/{id}/favorite-products")
    public ResponseEntity<List<FavoriteProductDto>> getFavoriteProducts(@PathVariable UUID id) {
        // Get customer profile by userId
        Optional<CustomerProfile> optionalCp = customerProfileRepository.findByUserId(id);
        if (optionalCp.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        CustomerProfile cp = optionalCp.get();
        // Get favorite products for this customer profile
        List<FavoriteProduct> favoriteProducts = favoriteProductRepository.findByCustomerProfile(cp);
        List<FavoriteProductDto> dtos = favoriteProducts.stream()
                .map(fp -> FavoriteProductDto.builder()
                        .id(fp.getId())
                        .customerProfileId(fp.getCustomerProfile().getId())
                        .productId(fp.getProductId())
                        .productName(fp.getProductName())
                        .productImageUrl(fp.getProductImageUrl())
                        .addedAt(fp.getAddedAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    @GetMapping("/{id}/search-history")
    public ResponseEntity<List<SearchHistoryDto>> getSearchHistory(@PathVariable UUID id) {
        // Get customer profile by userId
        Optional<CustomerProfile> optionalCp = customerProfileRepository.findByUserId(id);
        if (optionalCp.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        CustomerProfile cp = optionalCp.get();
        // Get search history for this customer profile
        List<SearchHistory> searchHistoryList = searchHistoryRepository.findByCustomerProfileId(cp.getId());
        List<SearchHistoryDto> dtos = searchHistoryList.stream()
                .map(sh -> SearchHistoryDto.builder()
                        .id(sh.getId())
                        .customerProfileId(sh.getCustomerProfile().getId())
                        .query(sh.getQuery())
                        .searchTime(sh.getSearchTime())
                        .resultsCount(sh.getResultsCount())
                        .clickedResultId(sh.getClickedResultId())
                        .clickedResultType(sh.getClickedResultType())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    @GetMapping("/{id}/customer-profile")
    public ResponseEntity<CustomerProfileDto> getCustomerProfileByUserId(@PathVariable UUID id) {
        return customerProfileRepository.findByUserId(id)
                .map(cp -> CustomerProfileDto.builder()
                        .id(cp.getId())
                        .userId(cp.getUserId())
                        .build())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}