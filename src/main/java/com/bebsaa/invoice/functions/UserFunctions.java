package com.bebsaa.invoice.functions;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.function.Function;

@Configuration
public class UserFunctions {

    @Bean
    public Function<UserRequest, String> login() {
        return request -> {
            // Implement login logic here
            if ("test@example.com".equals(request.getEmail()) && "password123".equals(request.getPassword())) {
                return "dummy-jwt-token";
            }
            throw new RuntimeException("Invalid credentials");
        };
    }

    @Bean
    public Function<Void, String> logout() {
        return request -> "Logged out successfully";
    }

    @Bean
    public Function<UserRequest, String> createUser() {
        return request -> {
            // Implement create user logic here
            return "User created successfully";
        };
    }

    @Bean
    public Function<String, UserResponse> getUser() {
        return userId -> {
            // Implement get user logic here
            return new UserResponse(userId, "test@example.com");
        };
    }

    @Bean
    public Function<UpdateUserRequest, String> updateUser() {
        return request -> {
            // Implement update user logic here
            return "User updated successfully";
        };
    }

    @Bean
    public Function<String, String> deleteUser() {
        return userId -> "User deleted successfully";
    }
}