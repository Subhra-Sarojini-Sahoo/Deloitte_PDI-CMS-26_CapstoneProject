


package com.eventzen.auth_service.service;

import com.eventzen.auth_service.service.EventService;
import com.eventzen.auth_service.model.Event;
import com.eventzen.auth_service.model.Location;
import com.eventzen.auth_service.model.User;
import com.eventzen.auth_service.repository.EventRepository;
import com.eventzen.auth_service.repository.LocationRepository;
import com.eventzen.auth_service.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private EventService eventService;

    private User vendor;
    private User admin;
    private User customer;
    private Location location;
    private Event event;

    @BeforeEach
    void setUp() {
        vendor = new User();
        vendor.setId(1L);
        vendor.setName("Vendor One");
        vendor.setEmail("vendor@test.com");
        vendor.setPassword("1234");
        vendor.setRole(User.Role.VENDOR);

        admin = new User();
        admin.setId(2L);
        admin.setName("Admin One");
        admin.setEmail("admin@test.com");
        admin.setPassword("1234");
        admin.setRole(User.Role.ADMIN);

        customer = new User();
        customer.setId(3L);
        customer.setName("Customer One");
        customer.setEmail("customer@test.com");
        customer.setPassword("1234");
        customer.setRole(User.Role.CUSTOMER);

        location = new Location();
        location.setId(10L);
        location.setName("Town Hall");
        location.setAddress("Main Road");
        location.setCapacity(200);
        location.setVendor(vendor);

        event = new Event();
        event.setId(100L);
        event.setName("Music Night");
        event.setDate(LocalDate.of(2026, 4, 10));
        event.setStartTime(LocalTime.of(18, 0));
        event.setEndTime(LocalTime.of(21, 0));
        event.setPrice(500.0);
        event.setVendor(vendor);
        event.setLocation(location);
    }

    @Test
    void testCreateEventSuccess() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(vendor));
        when(locationRepository.findById(10L)).thenReturn(Optional.of(location));
        when(eventRepository.countOverlappingEvents(
                10L,
                event.getDate(),
                event.getStartTime(),
                event.getEndTime()
        )).thenReturn(0L);
        when(eventRepository.save(event)).thenReturn(event);

        Event savedEvent = eventService.createEvent(event);

        assertNotNull(savedEvent);
        assertEquals("Music Night", savedEvent.getName());
        assertEquals(vendor.getId(), savedEvent.getVendor().getId());
        assertEquals(location.getId(), savedEvent.getLocation().getId());
    }

    @Test
    void testCreateEventFailsWhenOverlapExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(vendor));
        when(locationRepository.findById(10L)).thenReturn(Optional.of(location));
        when(eventRepository.countOverlappingEvents(
                10L,
                event.getDate(),
                event.getStartTime(),
                event.getEndTime()
        )).thenReturn(1L);

        assertThrows(ResponseStatusException.class, () -> eventService.createEvent(event));
    }

    @Test
    void testCreateEventFailsWhenCustomerTriesToCreate() {
        event.setVendor(customer);

        when(userRepository.findById(3L)).thenReturn(Optional.of(customer));

        assertThrows(ResponseStatusException.class, () -> eventService.createEvent(event));
    }

    @Test
    void testGetAllEvents() {
        when(eventRepository.findAll()).thenReturn(java.util.List.of(event));

        assertEquals(1, eventService.getAllEvents().size());
    }

    @Test
    void testUpdateEventSuccess() {
        Event updatedEvent = new Event();
        updatedEvent.setName("Updated Music Night");
        updatedEvent.setDate(LocalDate.of(2026, 4, 10));
        updatedEvent.setStartTime(LocalTime.of(19, 0));
        updatedEvent.setEndTime(LocalTime.of(22, 0));
        updatedEvent.setPrice(700.0);
        updatedEvent.setVendor(vendor);
        updatedEvent.setLocation(location);

        when(eventRepository.findById(100L)).thenReturn(Optional.of(event));
        when(userRepository.findById(1L)).thenReturn(Optional.of(vendor));
        when(locationRepository.findById(10L)).thenReturn(Optional.of(location));
        when(eventRepository.countOverlappingEvents(
                10L,
                updatedEvent.getDate(),
                updatedEvent.getStartTime(),
                updatedEvent.getEndTime()
        )).thenReturn(0L);
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        Event result = eventService.updateEvent(100L, updatedEvent);

        assertNotNull(result);
        assertEquals("Updated Music Night", event.getName());
        assertEquals(700.0, event.getPrice());
    }

    @Test
    void testDeleteEventByAdmin() {
        when(eventRepository.findById(100L)).thenReturn(Optional.of(event));
        when(userRepository.findById(2L)).thenReturn(Optional.of(admin));

        assertDoesNotThrow(() -> eventService.deleteEvent(100L, 2L));
        verify(eventRepository, times(1)).delete(event);
    }

    @Test
    void testDeleteEventFailsForUnauthorizedUser() {
        when(eventRepository.findById(100L)).thenReturn(Optional.of(event));
        when(userRepository.findById(3L)).thenReturn(Optional.of(customer));

        assertThrows(ResponseStatusException.class, () -> eventService.deleteEvent(100L, 3L));
    }
}