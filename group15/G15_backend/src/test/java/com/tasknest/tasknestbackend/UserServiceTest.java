package com.tasknest.tasknestbackend;

import com.tasknest.tasknestbackend.model.User;
import com.tasknest.tasknestbackend.repository.UserRepository;
import com.tasknest.tasknestbackend.service.UserService;
import org.junit.Assert;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private UserService userService;

    @Test
    public void testValidPassword() {
        UserService userService = new UserService();
        String password = "Password@123";
        String errorMessage = userService.validatePassword(password);

        Assert.assertNull(errorMessage);
    }

    @Test
    public void testShortPassword() {
        UserService userService = new UserService();
        String password = "Pass@1";
        String errorMessage = userService.validatePassword(password);

        Assert.assertEquals("Password must have a minimum length of 8 characters", errorMessage);
    }

    @Test
    public void testAllLowercase() {
        UserService userService = new UserService();
        String password = "password@123";
        String errorMessage = userService.validatePassword(password);

        Assert.assertEquals("Password must contain at least one uppercase letter", errorMessage);
    }

    @Test
    public void testAllUppercase() {
        UserService userService = new UserService();
        String password = "PASSWORD@123";
        String errorMessage = userService.validatePassword(password);

        Assert.assertEquals("Password must contain at least one lowercase letter", errorMessage);
    }

    @Test
    public void testNoNumber() {
        UserService userService = new UserService();
        String password = "Password@";
        String errorMessage = userService.validatePassword(password);

        Assert.assertEquals("Password must contain at least one number", errorMessage);
    }

    @Test
    public void testNoSpecialCharacter() {
        UserService userService = new UserService();
        String password = "Password123";
        String errorMessage = userService.validatePassword(password);

        Assert.assertEquals("Password must contain at least one special character (@, #, $, %, ^, &, +, =)", errorMessage);
    }

    @Test
    public void testCreateUser_ValidUser() {
        String validEmail = "newuser@example.com";
        User user = new User();
        user.setEmail(validEmail);
        user.setPassword("Password@123"); // Assuming the password is valid for this test

        when(this.userRepository.findByEmail(validEmail)).thenReturn(null);

        assertDoesNotThrow(() -> this.userService.createUser(user));

        verify(this.userRepository).findByEmail(validEmail);
        verify(this.userRepository).save(user);
    }

    @Test
    public void testCreateUser_ExistingEmail() {
        String existingEmail = "existinguser@example.com";
        User user = new User();
        user.setEmail(existingEmail);

        when(this.userRepository.findByEmail(existingEmail)).thenReturn(user);

        Assert.assertThrows(IllegalArgumentException.class, () -> userService.createUser(user));
        verify(this.userRepository).findByEmail(existingEmail);
        verify(this.userRepository).save(user);
    }

    @Test
    public void testCreateUser_InvalidPassword() {
        String invalidEmail = "invaliduser@example.com";
        User user = new User();
        user.setEmail(invalidEmail);
        user.setPassword("invalid"); // Assuming the password is invalid for this test

        when(this.userRepository.findByEmail(invalidEmail)).thenReturn(null);

        Assert.assertThrows(IllegalArgumentException.class, () -> this.userService.createUser(user));
        verify(this.userRepository).findByEmail(invalidEmail);
        verify(this.userRepository).save(user);
    }

    @Test
    public void testLoginUser_SuccessfulLogin() {
        String email = "existing@example.com";
        String password = "correctpassword";

        User user = new User();
        user.setEmail(email);
        user.setPassword("correctpassword");

        when(this.userRepository.findByEmail(email)).thenReturn(user);

        boolean result = this.userService.loginUser(email, password);

        Assert.assertTrue(result);
        verify(this.userRepository).findByEmail(email);
    }

    @Test
    public void testLoginUser_EmailNotFound() {
        String email = "notfound@example.com";
        String password = "password";

        when(this.userRepository.findByEmail(email)).thenReturn(null);

        boolean result = this.userService.loginUser(email, password);

        Assert.assertFalse(result);
        verify(this.userRepository).findByEmail(email);
    }

    @Test
    public void testLoginUser_IncorrectPassword() {
        String email = "existing@example.com";
        String password = "incorrectpassword";

        User user = new User();
        user.setEmail(email);
        user.setPassword("correctpassword");

        when(this.userRepository.findByEmail(email)).thenReturn(user);

        boolean result = this.userService.loginUser(email, password);

        Assert.assertFalse(result);
        verify(this.userRepository).findByEmail(email);
    }

    @Test
    public void testResetPassword_SuccessfulReset() {
        String email = "existing@example.com";
        String password = "Password@123";
        String securityQuestion = "What is your first pet?";
        String securityAnswer = "Dog";
        String newPassword = "Password@1";

        User user = new User();

        user.setEmail(email);
        user.setPassword(password);
        user.setSecurityQuestion(securityQuestion);
        user.setSecurityAnswer(securityAnswer);

        when(this.userRepository.findByEmail(email)).thenReturn(user);

        String result = this.userService.resetPassword(email, securityQuestion, securityAnswer, newPassword);

        Assert.assertEquals("Password reset successful", result);
        Assert.assertEquals(newPassword, user.getPassword());
        verify(this.userRepository).findByEmail(email);
        verify(this.userRepository).save(user);
    }

    @Test
    public void testResetPassword_EmailNotFound() {
        String email = "existing@example.com";
        String password = "Password@123";
        String securityQuestion = "What is your first pet?";
        String securityAnswer = "Dog";
        String newPassword = "Password@1";

        when(this.userRepository.findByEmail(email)).thenReturn(null);

        String result = this.userService.resetPassword(email, securityQuestion, securityAnswer, newPassword);

        Assert.assertEquals("Email is not registered.", result);
        verify(this.userRepository).findByEmail(email);
    }

    @Test
    public void testResetPassword_WrongSecurityQuestion() {
        String email = "existing@example.com";
        String password = "Password@123";
        String securityQuestion = "What is your first pet?";
        String securityAnswer = "Dog";
        String newPassword = "Password@1";

        User user = new User();

        user.setEmail(email);
        user.setPassword(password);
        user.setSecurityQuestion("What is your favorite movie?");
        user.setSecurityAnswer(securityAnswer);

        when(this.userRepository.findByEmail(email)).thenReturn(user);

        String result = this.userService.resetPassword(email, securityQuestion, securityAnswer, newPassword);

        Assert.assertEquals("Wrong security question.", result);
        verify(this.userRepository).findByEmail(email);
    }

    @Test
    public void testResetPassword_IncorrectAnswer() {
        String email = "existing@example.com";
        String password = "Password@123";
        String securityQuestion = "What is your first pet?";
        String securityAnswer = "Dog";
        String newPassword = "Password@1";

        User user = new User();

        user.setEmail(email);
        user.setPassword(password);
        user.setSecurityQuestion(securityQuestion);
        user.setSecurityAnswer("Cat");

        when(this.userRepository.findByEmail(email)).thenReturn(user);

        String result = this.userService.resetPassword(email, securityQuestion, securityAnswer, newPassword);

        Assert.assertEquals("Incorrect answer.", result);
        verify(this.userRepository).findByEmail(email);
    }

    @Test
    public void testResetPassword_InvalidPassword() {
        String email = "existing@example.com";
        String password = "Password@123";
        String securityQuestion = "What is your first pet?";
        String securityAnswer = "Dog";
        String newPassword = "weak";

        User user = new User();

        user.setEmail(email);
        user.setPassword(password);
        user.setSecurityQuestion(securityQuestion);
        user.setSecurityAnswer(securityAnswer);

        when(this.userRepository.findByEmail(email)).thenReturn(user);

        String result = this.userService.resetPassword(email, securityQuestion, securityAnswer, newPassword);

        Assert.assertEquals("Password must have a minimum length of 8 characters", result);
        verify(this.userRepository).findByEmail(email);
    }
}
