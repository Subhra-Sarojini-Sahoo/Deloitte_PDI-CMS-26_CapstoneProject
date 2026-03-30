package com.eventzen.auth_service.controller;

import com.eventzen.auth_service.dto.LoginResponse;
import com.eventzen.auth_service.model.User;
import com.eventzen.auth_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody User loginUser) {
        return authService.login(loginUser);
    }
}