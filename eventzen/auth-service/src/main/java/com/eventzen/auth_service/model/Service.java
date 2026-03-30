package com.eventzen.auth_service.model;

import jakarta.persistence.*;

@Entity
public class Service {

    public enum Category {
        CATERING,
        MUSIC,
        DECORATION,
        PHOTOGRAPHY,
        VENUE,
        BIRTHDAY_PLANNER,
        ENTERTAINMENT,
        EVENT_PLANNING
    }

    public enum AvailabilityStatus {
        AVAILABLE,
        UNAVAILABLE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceName;

    @Enumerated(EnumType.STRING)
    private Category category;

    private String description;

    private Double price;

    @Enumerated(EnumType.STRING)
    private AvailabilityStatus availabilityStatus;

    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private User vendor;

    
    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public AvailabilityStatus getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(AvailabilityStatus availabilityStatus) { this.availabilityStatus = availabilityStatus; }

    public User getVendor() { return vendor; }
    public void setVendor(User vendor) { this.vendor = vendor; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }
}