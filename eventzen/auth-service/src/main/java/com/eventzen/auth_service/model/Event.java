
package com.eventzen.auth_service.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private double price;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private User vendor;

    

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }

    public User getVendor() { return vendor; }
    public void setVendor(User vendor) { this.vendor = vendor; }
}
