package com.eventzen.auth_service.service;

import com.eventzen.auth_service.dto.EventDTO;
import com.eventzen.auth_service.model.Event;
import com.eventzen.auth_service.model.Location;
import com.eventzen.auth_service.model.User;
import com.eventzen.auth_service.repository.EventRepository;
import com.eventzen.auth_service.repository.LocationRepository;
import com.eventzen.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.eventzen.auth_service.dto.EventDTO;
import java.util.List;

@org.springframework.stereotype.Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    public Event createEvent(Event event) {
        if (event.getVendor() == null || event.getLocation() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vendor and Location must be provided");
        }

        User vendor = getUser(event.getVendor().getId());

        if (vendor.getRole() != User.Role.VENDOR && vendor.getRole() != User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only vendor/admin");
        }

        Location location = getLocation(event.getLocation().getId());

        long count = eventRepository.countOverlappingEvents(
                location.getId(),
                event.getDate(),
                event.getStartTime(),
                event.getEndTime()
        );

        if (count > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event overlap");
        }

        event.setVendor(vendor);
        event.setLocation(location);

        return eventRepository.save(event);
    }

    public List<EventDTO> getAllEvents() {
    return eventRepository.findAll().stream().map(e -> {
        EventDTO dto = new EventDTO();
        dto.id = e.getId();
        dto.name = e.getName();
        dto.date = e.getDate();
        dto.startTime = e.getStartTime();
        dto.endTime = e.getEndTime();
        dto.price = e.getPrice();
        dto.locationId = e.getLocation().getId();
        dto.locationName = e.getLocation().getName();
        dto.vendorId = e.getVendor().getId();
        dto.vendorName = e.getVendor().getName();
        return dto;
    }).toList();
}

    public Event updateEvent(Long id, Event updated) {
        Event existing = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        if (updated.getVendor() == null || updated.getLocation() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vendor & Location required");
        }

        User vendor = getUser(updated.getVendor().getId());

        if (vendor.getRole() != User.Role.VENDOR && vendor.getRole() != User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only vendor/admin");
        }

        if (vendor.getRole() == User.Role.VENDOR &&
                !existing.getVendor().getId().equals(vendor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only own events");
        }

        Location location = getLocation(updated.getLocation().getId());

        long count = eventRepository.countOverlappingEvents(
                location.getId(),
                updated.getDate(),
                updated.getStartTime(),
                updated.getEndTime()
        );

        if (count > 0 &&
                (!existing.getLocation().getId().equals(location.getId())
                        || !existing.getDate().equals(updated.getDate())
                        || !existing.getStartTime().equals(updated.getStartTime())
                        || !existing.getEndTime().equals(updated.getEndTime()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event overlap");
        }

        existing.setName(updated.getName());
        existing.setDate(updated.getDate());
        existing.setStartTime(updated.getStartTime());
        existing.setEndTime(updated.getEndTime());
        existing.setPrice(updated.getPrice());
        existing.setLocation(location);
        existing.setVendor(vendor);

        return eventRepository.save(existing);
    }

    public void deleteEvent(Long id, Long userId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        User user = getUser(userId);

        if (user.getRole() != User.Role.ADMIN &&
                !(user.getRole() == User.Role.VENDOR &&
                        event.getVendor().getId().equals(user.getId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }

        eventRepository.delete(event);
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Location getLocation(Long id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found"));
    }
}