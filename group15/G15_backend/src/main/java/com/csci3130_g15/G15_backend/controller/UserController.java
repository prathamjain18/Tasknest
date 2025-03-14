package com.csci3130_g15.G15_backend.controller;

import com.csci3130_g15.G15_backend.dtos.LoginRequest;
import com.csci3130_g15.G15_backend.dtos.PasswordResetRequest;
import com.csci3130_g15.G15_backend.dtos.UserRegisterRequest;
import com.csci3130_g15.G15_backend.dtos.WorkspaceRequest;
import com.csci3130_g15.G15_backend.model.User;
import com.csci3130_g15.G15_backend.model.Workspace;
import com.csci3130_g15.G15_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody UserRegisterRequest registerRequest) {
        try {
            String email = registerRequest.getEmail();
            String password = registerRequest.getPassword();
            String userType = registerRequest.getUserType();
            String securityQuestion = registerRequest.getSecurityQuestion();
            String securityAnswer = registerRequest.getSecurityAnswer();

            User user = new User(email, password, userType, securityQuestion, securityAnswer);

            userService.createUser(user);

            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Email already registered");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        boolean loginResult = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());

        Map<String, String> tokenMap = new HashMap<>();

        if (loginResult) {
            // generate JWT token
            String token = generateJwtToken(loginRequest.getEmail());

            tokenMap.put("data", token);
            tokenMap.put("status", "SUCCESS");

        }else {
            tokenMap.put("data", "n/a");
            tokenMap.put("status", "ERROR");
            tokenMap.put("message", "Incorrect email or password");

        }

        return ResponseEntity.ok().body(tokenMap);
    }

    private String generateJwtToken(String email) {
        // Create the JWT token with the email as the subject
        String token = Jwts.builder()
                .setSubject(email)
                .compact();

        return token;
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequest resetRequest) {
        String resetResult = userService.resetPassword(resetRequest.getEmail(),
                resetRequest.getSecurityQuestion(),
                resetRequest.getSecurityAnswer(),
                resetRequest.getNewPassword());

        if (resetResult.equals("Password reset successful")) {
            return ResponseEntity.ok().body(resetResult);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resetResult);
        }
    }

    @PostMapping("/workspaces")
    public ResponseEntity<?> createWorkspace(@RequestParam("userId") int userId, @RequestBody WorkspaceRequest workspaceRequest) {
        try {
            // Create a new workspace based on the request
            Workspace workspace = new Workspace(workspaceRequest.getName(), workspaceRequest.getDescription());

            // Add the workspace to the user's workspaces
            userService.addWorkspaceToUser(userId, workspace);

            return ResponseEntity.ok("Workspace created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create workspace");
        }
    }

    @GetMapping("/workspaces")
    public ResponseEntity<?> getUserWorkspaces(@RequestParam("userId") int userId) {
        try {
            List<Workspace> workspaces = userService.getUserWorkspaces(userId);

            return ResponseEntity.ok(workspaces);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve user workspaces");
        }
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<?> getAllUsers(){
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve users");
        }
    }
}
