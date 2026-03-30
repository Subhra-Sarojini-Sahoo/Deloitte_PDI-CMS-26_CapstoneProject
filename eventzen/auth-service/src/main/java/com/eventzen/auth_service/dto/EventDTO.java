package com.eventzen.auth_service.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventDTO {
    public Long id;
    public String name;
    public LocalDate date;
    public LocalTime startTime;
    public LocalTime endTime;
    public Double price;
    public Long locationId;
    public String locationName;
    public Long vendorId;
    public String vendorName;
}