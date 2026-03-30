

package com.eventzen.auth_service.service;

import com.eventzen.auth_service.model.Booking;
import org.springframework.stereotype.Service; 
import com.eventzen.auth_service.model.User;
import com.eventzen.auth_service.repository.BookingRepository;
import com.eventzen.auth_service.repository.ServiceRepository;
import com.eventzen.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    public Booking createBooking(Booking booking) {

        if (booking.getCustomer() == null || booking.getService() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer and Service must be provided");
        }

        if (booking.getEventDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event date is required");
        }

        if (booking.getAttendees() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attendees must be greater than 0");
        }

        User customer = userRepository.findById(booking.getCustomer().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (customer.getRole() != User.Role.CUSTOMER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only customers can create bookings");
        }

       com.eventzen.auth_service.model.Service service =
        serviceRepository.findById(booking.getService().getId())
        .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Service not found"));

        boolean exists = bookingRepository.existsByServiceIdAndEventDate(service.getId(), booking.getEventDate());

        if (exists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service already booked for this date");
        }

        booking.setCustomer(customer);
        booking.setService(service);
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus(Booking.Status.PENDING);

        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id, Long userId) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() == User.Role.CUSTOMER &&
                !booking.getCustomer().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Customer can cancel only own booking");
        }

        booking.setStatus(Booking.Status.REJECTED);
        return bookingRepository.save(booking);
    }

    public Booking updateAttendees(Long id, Long userId, int attendees) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (booking.getStatus() == Booking.Status.REJECTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cancelled booking cannot be updated");
        }

        if (user.getRole() == User.Role.CUSTOMER &&
                !booking.getCustomer().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Customer can update only own booking");
        }

        booking.setAttendees(attendees);
        return bookingRepository.save(booking);
    }

    public Booking updateStatus(Long id, Long vendorId, Booking.Status status) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        User vendor = userRepository.findById(vendorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (vendor.getRole() == User.Role.VENDOR &&
                !booking.getService().getVendor().getId().equals(vendor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot update others' bookings");
        }

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public List<Booking> getAll() {
        return bookingRepository.findAll();
    }

    public List<Booking> getCustomerBookings(Long id) {
        return bookingRepository.findByCustomerId(id);
    }

    public List<Booking> getVendorBookings(Long id) {
        return bookingRepository.findByServiceVendorId(id);
    }

    public void deleteBooking(Long id, Long userId) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() == User.Role.CUSTOMER &&
                !booking.getCustomer().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }

        bookingRepository.delete(booking);
    }
}