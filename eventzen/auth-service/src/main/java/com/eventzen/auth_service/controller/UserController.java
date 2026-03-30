package com.eventzen.auth_service.controller;

import com.eventzen.auth_service.model.User;
import com.eventzen.auth_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public List<User> getAllUsers(@RequestParam Long userId) {
        return userService.getAllUsers(userId);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id, @RequestParam Long userId) {
        userService.deleteUser(id, userId);
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id, @RequestParam Long userId) {
        return userService.getUserById(id, userId);
    }
}