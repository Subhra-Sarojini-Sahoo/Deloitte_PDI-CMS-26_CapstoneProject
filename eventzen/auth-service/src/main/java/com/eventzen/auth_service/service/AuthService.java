package com.eventzen.auth_service.service;

import com.eventzen.auth_service.dto.LoginResponse;
import com.eventzen.auth_service.model.User;
import com.eventzen.auth_service.repository.UserRepository;
import com.eventzen.auth_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@org.springframework.stereotype.Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {

        if (user.getName() == null || user.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        if (user.getRole() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is required");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
        }

        if (user.getRole() == User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin cannot be registered");
        }

        return userRepository.save(user);
    }

    public LoginResponse login(User loginUser) {

        if (loginUser.getEmail() == null || loginUser.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }

        if (loginUser.getPassword() == null || loginUser.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        User user = userRepository.findByEmail(loginUser.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        if (!user.getPassword().equals(loginUser.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        String token = JwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                token
        );
    }
}