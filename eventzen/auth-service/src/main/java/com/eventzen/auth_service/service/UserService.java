package com.eventzen.auth_service.service;

import com.eventzen.auth_service.model.User;
import com.eventzen.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers(Long userId) {
        User currentUser = getUserOrThrow(userId);

        if (currentUser.getRole() != User.Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Only admin can view all users");
        }

        return userRepository.findAll();
    }

    public void deleteUser(Long id, Long userId) {
        User currentUser = getUserOrThrow(userId);

        if (currentUser.getRole() != User.Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Only admin can delete users");
        }

        User targetUser = getUserOrThrow(id);

        if (targetUser.getRole() == User.Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Admin user cannot be deleted");
        }

        userRepository.delete(targetUser);
    }

    public User getUserById(Long id, Long userId) {
        User currentUser = getUserOrThrow(userId);

        if (currentUser.getRole() != User.Role.ADMIN && !currentUser.getId().equals(id)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Not authorized to view this user");
        }

        return getUserOrThrow(id);
    }

    private User getUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));
    }
}