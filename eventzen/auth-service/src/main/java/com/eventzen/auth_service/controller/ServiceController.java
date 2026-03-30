package com.eventzen.auth_service.controller;

import com.eventzen.auth_service.model.Service;
import com.eventzen.auth_service.service.ServiceManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/services")
public class ServiceController {

    @Autowired
    private ServiceManagementService serviceManagementService;

    @PostMapping
    public Service createService(@RequestBody Service service) {
        return serviceManagementService.createService(service);
    }

    @GetMapping
    public List<Service> getAllServices() {
        return serviceManagementService.getAllServices();
    }

    @GetMapping("/vendor/{vendorId}")
    public List<Service> getVendorServices(@PathVariable Long vendorId) {
        return serviceManagementService.getVendorServices(vendorId);
    }

    @PutMapping("/{id}")
    public Service updateService(@PathVariable Long id,
                                 @RequestBody Service updatedService) {
        return serviceManagementService.updateService(id, updatedService);
    }

    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable Long id,
                              @RequestParam Long userId) {
        serviceManagementService.deleteService(id, userId);
    }
}