package com.eventzen.auth_service.repository;

import com.eventzen.auth_service.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByVendorId(Long vendorId);
}