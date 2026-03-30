package com.eventzen.auth_service.service;

import com.eventzen.auth_service.model.User;
import com.eventzen.auth_service.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User admin;
    private User customer;
    private User vendor;

    @BeforeEach
    void setUp() {
        admin = new User();
        admin.setId(1L);
        admin.setName("Admin");
        admin.setEmail("admin@test.com");
        admin.setPassword("1234");
        admin.setRole(User.Role.ADMIN);

        customer = new User();
        customer.setId(2L);
        customer.setName("Customer");
        customer.setEmail("customer@test.com");
        customer.setPassword("1234");
        customer.setRole(User.Role.CUSTOMER);

        vendor = new User();
        vendor.setId(3L);
        vendor.setName("Vendor");
        vendor.setEmail("vendor@test.com");
        vendor.setPassword("1234");
        vendor.setRole(User.Role.VENDOR);
    }

    @Test
    void testGetAllUsersByAdmin() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(userRepository.findAll()).thenReturn(List.of(admin, customer, vendor));

        List<User> users = userService.getAllUsers(1L);

        assertNotNull(users);
        assertEquals(3, users.size());
    }

    @Test
    void testGetAllUsersFailsForNonAdmin() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(customer));

        assertThrows(ResponseStatusException.class,
                () -> userService.getAllUsers(2L));
    }

    @Test
    void testGetUserByIdAsAdmin() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(userRepository.findById(2L)).thenReturn(Optional.of(customer));

        User found = userService.getUserById(2L, 1L);

        assertNotNull(found);
        assertEquals("Customer", found.getName());
    }

    @Test
    void testGetUserByIdSelf() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(customer));

        User found = userService.getUserById(2L, 2L);

        assertNotNull(found);
        assertEquals("Customer", found.getName());
    }

    @Test
    void testDeleteUserByAdmin() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(userRepository.findById(2L)).thenReturn(Optional.of(customer));

        assertDoesNotThrow(() -> userService.deleteUser(2L, 1L));
        verify(userRepository, times(1)).delete(customer);
    }

    @Test
    void testDeleteAdminFails() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));

        assertThrows(ResponseStatusException.class,
                () -> userService.deleteUser(1L, 1L));
    }
}