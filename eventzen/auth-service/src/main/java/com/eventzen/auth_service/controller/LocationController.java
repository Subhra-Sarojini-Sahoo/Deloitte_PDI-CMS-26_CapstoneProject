package com.eventzen.auth_service.controller;

import com.eventzen.auth_service.model.Location;
import com.eventzen.auth_service.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping
    public List<Location> getAllLocations(@RequestParam Long userId) {
        return locationService.getAllLocations(userId);
    }

    @PostMapping
    public Location createLocation(@RequestBody Location location) {
        return locationService.createLocation(location);
    }

    @PutMapping("/{id}")
    public Location updateLocation(@PathVariable Long id,
                                   @RequestBody Location updatedLocation) {
        return locationService.updateLocation(id, updatedLocation);
    }

    @DeleteMapping("/{id}")
    public void deleteLocation(@PathVariable Long id,
                               @RequestParam Long userId) {
        locationService.deleteLocation(id, userId);
    }
}