package com.tasknest.tasknestbackend.service;

import com.tasknest.tasknestbackend.model.User;
import com.tasknest.tasknestbackend.model.Workspace;
import com.tasknest.tasknestbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    public void createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new IllegalArgumentException("Email already registered.");
        }

        String errorMessage = validatePassword(user.getPassword());

        if (errorMessage != null) {
            throw new IllegalArgumentException(errorMessage);
        }

        userRepository.save(user);
    }

    public String validatePassword(String password) {
        //minimum length check
        int minLength = 8;

        if (password.length() < minLength) {
            return "Password must have a minimum length of 8 characters";
        }

        //uppercase check
        if (!password.matches(".*[A-Z].*")) {
            return "Password must contain at least one uppercase letter";
        }

        //lowercase check
        if (!password.matches(".*[a-z].*")) {
            return "Password must contain at least one lowercase letter";
        }

        //number check
        if (!password.matches(".*\\d.*")) {
            return "Password must contain at least one number";
        }

        //special character check
        if (!password.matches(".*[@#$%^&+=].*")) {
            return "Password must contain at least one special character (@, #, $, %, ^, &, +, =)";
        }

        return null;
    }

    public boolean loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);

        //email is not registered
        if (user == null){
            return false;
        }

        //password does not match
        if (!password.equals(user.getPassword())) {
            return false;
        }

        return true;
    }

    public String resetPassword(String email, String securityQuestion,String securityAnswer, String newPassword) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return "Email is not registered.";
        }

        if (!user.getSecurityQuestion().equals(securityQuestion)){
            return "Wrong security question.";
        }

        if (!user.getSecurityAnswer().equals(securityAnswer)) {
            return "Incorrect answer.";
        }

        String errorMessage = validatePassword(newPassword);
        if (errorMessage != null) {
            return errorMessage;
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        return "Password reset successful";
    }

    public List<Workspace> getUserWorkspaces(int userId) {
        User user = userRepository.findByUserID(userId);

        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        return user.getWorkspaces();
    }

    public void addWorkspaceToUser(int userId, Workspace workspace) {
        User user = userRepository.findByUserID(userId);

        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        List<Workspace> userWorkspaces = user.getWorkspaces();
        userWorkspaces.add(workspace);
        user.setWorkspaces(userWorkspaces);

        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        List<User> user = userRepository.findAll();

        return user;
    }
}
