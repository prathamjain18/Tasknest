package com.csci3130_g15.G15_backend.dtos;

public class TaskCreationRequest {
    private String name;
    private String status;
    private String dueDate;
    private int boardID;

    public TaskCreationRequest(String name, String status, String dueDate, int boardID) {
        this.name = name;
        this.status = status;
        this.dueDate = dueDate;
        this.boardID = boardID;
    }

    public TaskCreationRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public int getBoardID() {
        return boardID;
    }

    public void setBoardID(int boardID) {
        this.boardID = boardID;
    }
}
