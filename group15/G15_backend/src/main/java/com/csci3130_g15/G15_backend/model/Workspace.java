package com.csci3130_g15.G15_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workspace")
public class Workspace {
    //id, name
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "workspace_id")
    private int workspaceID;
    @Column(name = "workspace_name")
    private String workspaceName;
    @Column(name = "workspace_description")
    private String workspaceDes;

    @JsonIgnore
    @ManyToMany(mappedBy = "workspaces")
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Board> boards = new ArrayList<>();

    public Workspace(String workspaceName, String workspaceDes) {
        this.workspaceName = workspaceName;
        this.workspaceDes = workspaceDes;
    }

    public Workspace() {

    }

    public int getWorkspaceID() {
        return workspaceID;
    }

    public void setWorkspaceID(int workspaceID) {
        this.workspaceID = workspaceID;
    }

    public String getWorkspaceName() {
        return workspaceName;
    }

    public void setWorkspaceName(String workspace_name) {
        this.workspaceName = workspace_name;
    }

    public String getWorkspaceDes() {
        return workspaceDes;
    }

    public void setWorkspaceDes(String workspaceDes) {
        this.workspaceDes = workspaceDes;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public List<Board> getBoards() {
        return boards;
    }

    public void setBoards(List<Board> boards) {
        this.boards = boards;
    }

    public void addBoard(Board board) {
        boards.add(board);
        board.setWorkspace(this);
    }

    public void removeBoard(Board board) {
        boards.remove(board);
        board.setWorkspace(null);
    }
}
