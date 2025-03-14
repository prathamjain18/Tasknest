package com.csci3130_g15.G15_backend.dtos;

public class UserRegisterRequest {
    private String email;
    private String password;
    private String userType;
    private String securityQuestion;
    private String securityAnswer;

    public UserRegisterRequest() {
    }

    public UserRegisterRequest(String email, String password, String userType, String securityQuestion, String securityAnswer) {
        this.email = email;
        this.password = password;
        this.userType = userType;
        this.securityQuestion = securityQuestion;
        this.securityAnswer = securityAnswer;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getSecurityQuestion() {
        return securityQuestion;
    }

    public void setSecurityQuestion(String securityQuestion) {
        this.securityQuestion = securityQuestion;
    }

    public String getSecurityAnswer() {
        return securityAnswer;
    }

    public void setSecurityAnswer(String securityAnswer) {
        this.securityAnswer = securityAnswer;
    }
}