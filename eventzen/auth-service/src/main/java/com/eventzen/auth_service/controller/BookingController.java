package com.eventzen.auth_service.controller;

import com.eventzen.auth_service.model.Booking;
import com.eventzen.auth_service.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

  
    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable Long id,
                                 @RequestParam Long userId) {
        return bookingService.cancelBooking(id, userId);
    }

    
    @PutMapping("/{id}/attendees")
    public Booking updateAttendees(@PathVariable Long id,
                                   @RequestParam Long userId,
                                   @RequestParam int attendees) {
        return bookingService.updateAttendees(id, userId, attendees);
    }

    
    @PutMapping("/{id}/status")
    public Booking updateBookingStatus(@PathVariable Long id,
                                       @RequestParam Long vendorId,
                                       @RequestParam Booking.Status status) {
        return bookingService.updateStatus(id, vendorId, status);
    }

    
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAll();
    }

    
    @GetMapping("/customer/{id}")
    public List<Booking> getCustomerBookings(@PathVariable Long id) {
        return bookingService.getCustomerBookings(id);
    }

    
    @GetMapping("/vendor/{id}")
    public List<Booking> getVendorBookings(@PathVariable Long id) {
        return bookingService.getVendorBookings(id);
    }

    
    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id,
                              @RequestParam Long userId) {
        bookingService.deleteBooking(id, userId);
    }
}