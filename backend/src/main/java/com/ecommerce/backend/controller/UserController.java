package com.ecommerce.backend.controller;

import org.springframework.http.HttpHeaders;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.backend.model.LoginRequest;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.model.UserDTO;
import com.ecommerce.backend.service.JwtService;
import com.ecommerce.backend.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    // fetch all users
    @GetMapping("/getallusers")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.status(200).body(userService.getAllUsers());
    }

    // validate user when logging in
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest, HttpServletRequest request,
            HttpServletResponse response) {
        Optional<User> userOpt = userService.getUserByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();  // unwrapping from Optional to User

        // // or even simpler
        // User user = userOpt.orElseThrow(
        // () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // // functional un-wrapping
        // return userService.getUserByEmail(loginRequest.getEmail())
        //         .filter(user -> user.getPassword().equals(loginRequest.getPassword()))
        //         .map(user -> ResponseEntity.ok("Login successful"))
        //         .orElse(ResponseEntity.status(401).body("Incorrect email or password"));

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(401).body("Incorrect password");
        }

        String jwtToken = jwtService.generateToken(user.getEmail());

        boolean isHttps = request.isSecure(); // check if dev/prod environment

        ResponseCookie cookie = ResponseCookie.from("token", jwtToken)
                .httpOnly(true)
                .secure(isHttps) // set to false for local dev
                .sameSite(isHttps ? "None" : "Lax")
                .path("/")
                .maxAge(Duration.ofDays(7))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // UserDTO userDTO = new UserDTO(user.getId(), user.getEmail());

        // sending the token in the body, as third-party might not allow to read from the cookie
        Map<String, Object> body = Map.of("id", user.getId(), "email", user.getEmail(), "token", jwtToken);
        return ResponseEntity.status(200).body(body);
    }

    // insert a record (new user)
    @PostMapping("/saveuser")
    public ResponseEntity<String> saveUser(@RequestBody User user) {
        return ResponseEntity.status(201).body("Saved Succesfully...\n\n" + userService.saveUser(user));
    }

    @GetMapping("/validatetoken")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String token = jwtService.extractTokenFromCookie(request);
        if (token == null || !jwtService.validateToken(token) || token.isEmpty()) {
            return ResponseEntity.status(403).body("Invalid token");
        }

        String email = jwtService.extractEmail(token);
        Optional<User> userOpt = userService.getUserByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();
        return ResponseEntity.status(200).body(new UserDTO(user.getId(), user.getEmail()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        boolean isHttps = request.isSecure(); // check if dev/prod environment

        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(isHttps) // set to false for local dev if needed
                .sameSite(isHttps ? "None" : "Lax")
                .path("/")
                .maxAge(0) // expire immediately
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.status(200).body("Logged out");
    }
}
