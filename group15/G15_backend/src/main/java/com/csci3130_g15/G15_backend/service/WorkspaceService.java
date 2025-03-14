package com.csci3130_g15.G15_backend.service;

import com.csci3130_g15.G15_backend.model.Workspace;
import com.csci3130_g15.G15_backend.repository.WorkspaceRepository;
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
