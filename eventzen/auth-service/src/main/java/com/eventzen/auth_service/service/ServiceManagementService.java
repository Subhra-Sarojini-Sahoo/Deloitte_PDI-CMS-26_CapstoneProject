package com.eventzen.auth_service.service;

import com.eventzen.auth_service.model.Location;
import com.eventzen.auth_service.model.Service;
import com.eventzen.auth_service.model.User;
import com.eventzen.auth_service.repository.BookingRepository;
import com.eventzen.auth_service.repository.LocationRepository;
import com.eventzen.auth_service.repository.ServiceRepository;
import com.eventzen.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@org.springframework.stereotype.Service
public class ServiceManagementService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Service createService(Service service) {

        if (service.getVendor() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vendor must be provided");
        }

        validateService(service);

        User vendor = getUserOrThrow(service.getVendor().getId());

        if (vendor.getRole() != User.Role.VENDOR && vendor.getRole() != User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only vendor or admin can create services");
        }

        service.setVendor(vendor);

        if (service.getCategory() == Service.Category.VENUE) {
            if (service.getLocation() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Location must be selected for venue service");
            }

            Location fullLocation = locationRepository.findById(service.getLocation().getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Location not found"));

            service.setLocation(fullLocation);
        } else {
            service.setLocation(null);
        }

        return serviceRepository.save(service);
    }

    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    public List<Service> getVendorServices(Long vendorId) {
        User vendor = getUserOrThrow(vendorId);
        return serviceRepository.findByVendor(vendor);
    }

    public Service updateService(Long id, Service updatedService) {

        Service existing = serviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        if (updatedService.getVendor() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vendor must be provided");
        }

        validateService(updatedService);

        User vendor = getUserOrThrow(updatedService.getVendor().getId());

        if (vendor.getRole() != User.Role.VENDOR && vendor.getRole() != User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only vendor/admin can update");
        }

        if (vendor.getRole() == User.Role.VENDOR &&
                !existing.getVendor().getId().equals(vendor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vendor can update only own services");
        }

        existing.setServiceName(updatedService.getServiceName());
        existing.setCategory(updatedService.getCategory());
        existing.setDescription(updatedService.getDescription());
        existing.setPrice(updatedService.getPrice());
        existing.setAvailabilityStatus(updatedService.getAvailabilityStatus());
        existing.setVendor(vendor);

        if (updatedService.getCategory() == Service.Category.VENUE) {
            if (updatedService.getLocation() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Location must be selected for venue service");
            }

            Location fullLocation = locationRepository.findById(updatedService.getLocation().getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Location not found"));

            existing.setLocation(fullLocation);
        } else {
            existing.setLocation(null);
        }

        return serviceRepository.save(existing);
    }

    public void deleteService(Long id, Long userId) {

    Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

    User user = getUserOrThrow(userId);

    if (user.getRole() != User.Role.ADMIN &&
            !(user.getRole() == User.Role.VENDOR &&
                    service.getVendor().getId().equals(user.getId()))) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
    }

    if (bookingRepository.existsByServiceId(id)) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cannot delete service with existing bookings"
        );
    }

    serviceRepository.delete(service);
}
    private void validateService(Service service) {
        if (service.getServiceName() == null || service.getServiceName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service name required");
        }

        if (service.getPrice() == null || service.getPrice() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Price must be > 0");
        }
    }

    private User getUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}