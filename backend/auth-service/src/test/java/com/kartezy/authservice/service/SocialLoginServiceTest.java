package com.kartezy.authservice.service;

import com.kartezy.authservice.dto.LoginResponse;
import com.kartezy.authservice.entity.OAuthAccount;
import com.kartezy.authservice.entity.Role;
import com.kartezy.authservice.entity.User;
import com.kartezy.authservice.repository.OAuthAccountRepository;
import com.kartezy.authservice.repository.RoleRepository;
import com.kartezy.authservice.repository.UserRepository;
import com.kartezy.authservice.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Tests for SocialLoginService.
 */
@ExtendWith(MockitoExtension.class)
public class SocialLoginServiceTest {

    @Mock
    private OAuthAccountRepository oauthAccountRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private JwtUtil jwtUtil;

    private SocialLoginService socialLoginService;
    private User testUser;

    @BeforeEach
    public void setUp() {
        socialLoginService = new SocialLoginService(
                oauthAccountRepository, userRepository, roleRepository, jwtUtil);

        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("test@gmail.com")
                .firstName("Test")
                .lastName("User")
                .passwordHash("")
                .status(com.kartezy.authservice.entity.UserStatus.ACTIVE)
                .emailVerified(true)
                .mfaEnabled(false)
                .roles(new HashSet<>())
                .build();
    }

    @Test
    public void testExistingOAuthUserLoggedIn() {
        when(oauthAccountRepository.findByProviderAndProviderUserId("GOOGLE", "12345"))
                .thenReturn(Optional.of(
                        OAuthAccount.builder()
                                .user(testUser)
                                .provider("GOOGLE")
                                .providerUserId("12345")
                                .build()
                ));
        when(jwtUtil.generateAccessToken(anyString())).thenReturn("access-token");
        when(jwtUtil.generateRefreshToken()).thenReturn("refresh-token");
        when(jwtUtil.getJwtExpiration()).thenReturn(86400000L);

        LoginResponse response = socialLoginService.authenticate(
                "google", "token123", "test@gmail.com",
                "Test", "User", "12345");

        assertNotNull(response);
        assertEquals("test@gmail.com", response.getEmail());
        assertEquals("Test", response.getFirstName());
        assertEquals("access-token", response.getAccessToken());

        verify(oauthAccountRepository).findByProviderAndProviderUserId("GOOGLE", "12345");
    }

    @Test
    public void testNewUserViaSocialLogin() {
        when(oauthAccountRepository.findByProviderAndProviderUserId("GOOGLE", "67890"))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail("new@facebook.com"))
                .thenReturn(Optional.empty());
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> {
                    User u = invocation.getArgument(0);
                    if (u.getId() == null) u.setId(UUID.randomUUID());
                    return u;
                });
        when(roleRepository.findByName("ROLE_USER"))
                .thenReturn(Optional.of(
                        Role.builder().name("ROLE_USER").build()
                ));
        when(jwtUtil.generateAccessToken(anyString())).thenReturn("access-token");
        when(jwtUtil.generateRefreshToken()).thenReturn("refresh-token");
        when(jwtUtil.getJwtExpiration()).thenReturn(86400000L);

        LoginResponse response = socialLoginService.authenticate(
                "facebook", "fb-token", "new@facebook.com",
                "New", "User", "67890");

        assertNotNull(response);
        assertEquals("new@facebook.com", response.getEmail());

        verify(userRepository, atLeastOnce()).save(any(User.class));
    }
}
