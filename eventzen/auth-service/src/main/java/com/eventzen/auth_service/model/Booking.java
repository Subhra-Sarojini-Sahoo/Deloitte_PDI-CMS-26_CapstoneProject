package com.eventzen.auth_service.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
public class Booking {

    public enum Status {
        PENDING,
        ACCEPTED,
        REJECTED,
        COMPLETED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int attendees;

    private LocalDateTime bookingTime;

    private LocalDate eventDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private String purpose;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getAttendees() { return attendees; }
    public void setAttendees(int attendees) { this.attendees = attendees; }

    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public Service getService() { return service; }
    public void setService(Service service) { this.service = service; }
}