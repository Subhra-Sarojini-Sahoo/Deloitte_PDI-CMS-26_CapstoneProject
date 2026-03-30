package com.eventzen.auth_service.repository;

import com.eventzen.auth_service.model.Service;
import com.eventzen.auth_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByVendor(User vendor);
    List<Service> findByCategory(Service.Category category);
}