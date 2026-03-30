package com.eventzen.auth_service.repository;

import com.eventzen.auth_service.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b JOIN FETCH b.service s JOIN FETCH s.vendor JOIN FETCH b.customer WHERE b.customer.id = :customerId")
    List<Booking> findByCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.service s JOIN FETCH b.customer WHERE s.vendor.id = :vendorId")
    List<Booking> findByServiceVendorId(@Param("vendorId") Long vendorId);

    boolean existsByServiceIdAndEventDate(Long serviceId, LocalDate eventDate);

    boolean existsByServiceId(Long serviceId);
}