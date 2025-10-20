package org.example.wheretogo.controller;

import org.example.wheretogo.model.User;
import org.example.wheretogo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = userService.register(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Пользователь успешно зарегистрирован");
            response.put("user", Map.of(
                    "id", savedUser.getId(),
                    "email", savedUser.getEmail(),
                    "username", savedUser.getUsername()
            ));

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Ошибка сервера"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            Optional<User> user = userService.authenticate(email, password);

            if (user.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Успешный вход");
                response.put("user", Map.of(
                        "id", user.get().getId(),
                        "email", user.get().getEmail(),
                        "username", user.get().getUsername()
                ));

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Неверный email или пароль"));
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Ошибка сервера"));
        }
    }
}