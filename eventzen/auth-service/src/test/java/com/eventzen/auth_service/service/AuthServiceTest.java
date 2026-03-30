package com.eventzen.auth_service.service;

import com.eventzen.auth_service.dto.LoginResponse;
import com.eventzen.auth_service.model.User;
import com.eventzen.auth_service.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    private User customer;
    private User admin;

    @BeforeEach
    void setUp() {
        customer = new User();
        customer.setId(1L);
        customer.setName("Customer One");
        customer.setEmail("customer@test.com");
        customer.setPassword("1234");
        customer.setRole(User.Role.CUSTOMER);

        admin = new User();
        admin.setId(2L);
        admin.setName("Admin One");
        admin.setEmail("admin@test.com");
        admin.setPassword("1234");
        admin.setRole(User.Role.ADMIN);
    }

    @Test
    void testRegisterSuccess() {
        when(userRepository.findByEmail(customer.getEmail())).thenReturn(Optional.empty());
        when(userRepository.save(customer)).thenReturn(customer);

        User savedUser = authService.register(customer);

        assertNotNull(savedUser);
        assertEquals("customer@test.com", savedUser.getEmail());
        assertEquals(User.Role.CUSTOMER, savedUser.getRole());
    }

    @Test
    void testRegisterFailsWhenEmailAlreadyExists() {
        when(userRepository.findByEmail(customer.getEmail())).thenReturn(Optional.of(customer));

        assertThrows(ResponseStatusException.class,
                () -> authService.register(customer));
    }

    @Test
    void testRegisterFailsForAdminRole() {
        when(userRepository.findByEmail(admin.getEmail())).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> authService.register(admin));
    }

    @Test
    void testLoginSuccess() {
        User loginUser = new User();
        loginUser.setEmail("customer@test.com");
        loginUser.setPassword("1234");

        when(userRepository.findByEmail("customer@test.com")).thenReturn(Optional.of(customer));

        LoginResponse response = authService.login(loginUser);

        assertNotNull(response);
        assertEquals(customer.getId(), response.getId());
        assertEquals(customer.getEmail(), response.getEmail());
        assertEquals(customer.getRole().name(), response.getRole());
        assertNotNull(response.getToken());
    }

    @Test
    void testLoginFailsForWrongPassword() {
        User loginUser = new User();
        loginUser.setEmail("customer@test.com");
        loginUser.setPassword("wrong");

        when(userRepository.findByEmail("customer@test.com")).thenReturn(Optional.of(customer));

        assertThrows(ResponseStatusException.class,
                () -> authService.login(loginUser));
    }

    @Test
    void testLoginFailsWhenUserNotFound() {
        User loginUser = new User();
        loginUser.setEmail("unknown@test.com");
        loginUser.setPassword("1234");

        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> authService.login(loginUser));
    }
}