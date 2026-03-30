package com.eventzen.auth_service.service;

import com.eventzen.auth_service.model.Location;
import com.eventzen.auth_service.model.User;
import com.eventzen.auth_service.repository.LocationRepository;
import com.eventzen.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@org.springframework.stereotype.Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Location> getAllLocations(Long userId) {
        User user = getUser(userId);

        if (user.getRole() == User.Role.ADMIN) {
            return locationRepository.findAll();
        }

        if (user.getRole() == User.Role.VENDOR) {
            return locationRepository.findByVendorId(userId);
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
    }

    public Location createLocation(Location location) {
        if (location.getVendor() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vendor must be provided");
        }

        validate(location);

        User vendor = getUser(location.getVendor().getId());

        if (vendor.getRole() != User.Role.VENDOR && vendor.getRole() != User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only vendor/admin can create");
        }

        location.setVendor(vendor);
        return locationRepository.save(location);
    }

    public Location updateLocation(Long id, Location updated) {
        Location existing = locationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found"));

        if (updated.getVendor() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vendor required");
        }

        validate(updated);

        User user = getUser(updated.getVendor().getId());

        if (user.getRole() != User.Role.VENDOR && user.getRole() != User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only vendor/admin");
        }

        if (user.getRole() == User.Role.VENDOR &&
                !existing.getVendor().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only own locations");
        }

        existing.setName(updated.getName());
        existing.setAddress(updated.getAddress());
        existing.setCapacity(updated.getCapacity());
        existing.setVendor(user);

        return locationRepository.save(existing);
    }

    public void deleteLocation(Long id, Long userId) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found"));

        User user = getUser(userId);

        if (user.getRole() != User.Role.ADMIN &&
                !(user.getRole() == User.Role.VENDOR &&
                        location.getVendor().getId().equals(user.getId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }

        locationRepository.delete(location);
    }

    private void validate(Location l) {
        if (l.getName() == null || l.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name required");
        }
        if (l.getAddress() == null || l.getAddress().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Address required");
        }
        if (l.getCapacity() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Capacity > 0");
        }
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}