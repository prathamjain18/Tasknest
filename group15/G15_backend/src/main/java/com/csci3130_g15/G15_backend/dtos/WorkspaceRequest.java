package com.csci3130_g15.G15_backend.dtos;

public class WorkspaceRequest {
    private String name;
    private String description;

    public WorkspaceRequest() {
    }

    public WorkspaceRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
