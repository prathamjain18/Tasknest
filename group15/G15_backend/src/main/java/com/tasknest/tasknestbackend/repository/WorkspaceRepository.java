package com.tasknest.tasknestbackend.repository;

import com.tasknest.tasknestbackend.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkspaceRepository extends JpaRepository <Workspace, Integer> {
    //The WorkspaceRepository interface extends the JpaRepository interface
    //so the CRUD operations can be used

    Optional<Workspace> findByWorkspaceID (int workspaceID);
}
