package com.eventzen.auth_service.controller;

import com.eventzen.auth_service.dto.EventDTO;
import com.eventzen.auth_service.model.Event;
import com.eventzen.auth_service.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }

    @GetMapping
public List<EventDTO> getAllEvents() {
    return eventService.getAllEvents();
}

    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id,
                             @RequestBody Event updatedEvent) {
        return eventService.updateEvent(id, updatedEvent);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id,
                            @RequestParam Long userId) {
        eventService.deleteEvent(id, userId);
    }
}