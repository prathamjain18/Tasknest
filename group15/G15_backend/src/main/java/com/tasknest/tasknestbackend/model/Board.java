package com.tasknest.tasknestbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "board")
public class Board {
    //id, name
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private int boardID;

    @Column(name = "board_name")
    private String boardName;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @OneToMany(mappedBy = "board")
    private List<Task> tasks = new ArrayList<>();

    public Board(String boardName) {
        this.boardName = boardName;
    }

    public Board() {

    }

    public int getBoardID() {
        return boardID;
    }

    public void setBoardID(int board_id) {
        this.boardID = board_id;
    }

    public String getBoardName() {
        return boardName;
    }

    public void setBoardName(String board_name) {
        this.boardName = board_name;
    }

    public Workspace getWorkspace() {
        return workspace;
    }

    public void setWorkspace(Workspace workspace) {
        this.workspace = workspace;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public void addTask(Task task) {
        tasks.add(task);
        task.setBoard(this);
    }

    public void removeTask(Task task) {
        tasks.remove(task);
        task.setBoard(null);
    }
}