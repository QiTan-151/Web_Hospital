package com.hospital.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.model.User;
import com.hospital.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Email và mật khẩu là bắt buộc"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Email không tồn tại"));
        }

        User user = userOpt.get();

        // Tạm thời check password đơn giản (giống JS của bạn dùng '123')
        if (!password.equals("123") && !password.equals(user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Mật khẩu không đúng"));
        }

        return ResponseEntity.ok(Map.of(
            "message", "Đăng nhập thành công",
            "user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "role", user.getRole()
            )
        ));
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Email và mật khẩu là bắt buộc"));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email đã tồn tại"));
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Đăng ký thành công"));
    }
}