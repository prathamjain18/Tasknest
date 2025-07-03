package com.tasknest.tasknestbackend.service;

import com.tasknest.tasknestbackend.model.Workspace;
import com.tasknest.tasknestbackend.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkspaceService {
    @Autowired
    WorkspaceRepository workspaceRepository;

    public String createWorkspace(Workspace workspace){
        if (workspace == null) {
            throw new IllegalArgumentException("Workspace cannot be null.");
        }

        workspaceRepository.save(workspace);
        return "Workspace successfully created";
    }

    public List<Workspace> getAllWorkspaces() {
        return workspaceRepository.findAll();
    }

    public Optional<Workspace> getWorkspaceById(int id) {
        return workspaceRepository.findByWorkspaceID(id);
    }
}
