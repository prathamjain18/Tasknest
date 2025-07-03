package com.tasknest.tasknestbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tasks")
public class Task {
    //id, name, summary, status, assigned user, finish date
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private int id;

    @Column(name = "task_name")
    private String taskName;
    @Column(name = "task_status")
    private String taskStatus;
    @Column(name = "task_finish_date")
    @DateTimeFormat
    private LocalDate dueDate;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "board_id")
    private Board board;

    @JsonIgnore
    @ManyToMany(mappedBy = "tasks")
    private List<User> users;

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public Task(String taskName, String taskStatus, LocalDate taskDueDate) {
        this.taskName = taskName;
        this.taskStatus = taskStatus;
        this.dueDate = taskDueDate;
    }

    public Task() {
    }

    public int getId() {
        return id;
    }

    public void setId(int task_id) {
        this.id = task_id;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String task_name) {
        this.taskName = task_name;
    }

    public String getTaskStatus() {
        return taskStatus;
    }

    public void setTaskStatus(String task_status) {
        this.taskStatus = task_status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Board getBoard() {
        return board;
    }

    public void setBoard(Board board) {
        this.board = board;
    }
}
