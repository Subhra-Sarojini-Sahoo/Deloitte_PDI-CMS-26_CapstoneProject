package com.eventzen.auth_service.service;

import com.eventzen.auth_service.model.Location;
import com.eventzen.auth_service.model.User;
import com.eventzen.auth_service.repository.LocationRepository;
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
public class LocationServiceTest {

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LocationService locationService;

    private User vendor;
    private User admin;
    private User customer;
    private Location location;

    @BeforeEach
    void setUp() {
        vendor = new User();
        vendor.setId(1L);
        vendor.setRole(User.Role.VENDOR);

        admin = new User();
        admin.setId(2L);
        admin.setRole(User.Role.ADMIN);

        customer = new User();
        customer.setId(3L);
        customer.setRole(User.Role.CUSTOMER);

        location = new Location();
        location.setId(10L);
        location.setName("Town Hall");
        location.setAddress("Main Road");
        location.setCapacity(200);
        location.setVendor(vendor);
    }

    @Test
    void testCreateLocationSuccess() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(vendor));
        when(locationRepository.save(location)).thenReturn(location);

        Location saved = locationService.createLocation(location);

        assertNotNull(saved);
        assertEquals("Town Hall", saved.getName());
    }

    @Test
    void testCreateLocationFailsForCustomer() {
        location.setVendor(customer);
        when(userRepository.findById(3L)).thenReturn(Optional.of(customer));

        assertThrows(ResponseStatusException.class,
                () -> locationService.createLocation(location));
    }

    @Test
    void testUpdateLocationSuccess() {
        Location updated = new Location();
        updated.setName("Updated Hall");
        updated.setAddress("New Address");
        updated.setCapacity(300);
        updated.setVendor(vendor);

        when(locationRepository.findById(10L)).thenReturn(Optional.of(location));
        when(userRepository.findById(1L)).thenReturn(Optional.of(vendor));
        when(locationRepository.save(any(Location.class))).thenReturn(location);

        Location result = locationService.updateLocation(10L, updated);

        assertNotNull(result);
        assertEquals("Updated Hall", location.getName());
    }

    @Test
    void testDeleteLocationByAdmin() {
        when(locationRepository.findById(10L)).thenReturn(Optional.of(location));
        when(userRepository.findById(2L)).thenReturn(Optional.of(admin));

        assertDoesNotThrow(() -> locationService.deleteLocation(10L, 2L));
        verify(locationRepository, times(1)).delete(location);
    }

    @Test
    void testDeleteLocationFailsForCustomer() {
        when(locationRepository.findById(10L)).thenReturn(Optional.of(location));
        when(userRepository.findById(3L)).thenReturn(Optional.of(customer));

        assertThrows(ResponseStatusException.class,
                () -> locationService.deleteLocation(10L, 3L));
    }
}