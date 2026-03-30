package com.eventzen.auth_service;

import com.eventzen.auth_service.model.User;
import com.eventzen.auth_service.repository.UserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	CommandLineRunner initAdmin(UserRepository userRepository) {
		return args -> {
			if (userRepository.findByEmail("admin@eventzen.com").isEmpty()) {

				User admin = new User();
				admin.setName("Admin");
				admin.setEmail("admin@eventzen.com");
				admin.setPassword("admin123");
				admin.setRole(User.Role.ADMIN);

				userRepository.save(admin);
			}
		};
	}
}