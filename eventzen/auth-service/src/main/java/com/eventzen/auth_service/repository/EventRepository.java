package com.eventzen.auth_service.repository;

import com.eventzen.auth_service.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends JpaRepository<Event, Long> {
    @Query("""
SELECT COUNT(e) FROM Event e
WHERE e.location.id = :locationId
AND e.date = :date
AND e.startTime < :endTime
AND e.endTime > :startTime
""")
    long countOverlappingEvents(
            @Param("locationId") Long locationId,
            @Param("date") java.time.LocalDate date,
            @Param("startTime") java.time.LocalTime startTime,
            @Param("endTime") java.time.LocalTime endTime
    );

}