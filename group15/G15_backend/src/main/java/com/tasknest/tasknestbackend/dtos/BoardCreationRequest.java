package com.tasknest.tasknestbackend.dtos;

public class BoardCreationRequest {
    private String name;
    private int workspaceId;

    public BoardCreationRequest(String name, int workspaceId) {
        this.name = name;
        this.workspaceId = workspaceId;
    }

    public BoardCreationRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(int workspaceId) {
        this.workspaceId = workspaceId;
    }
}
