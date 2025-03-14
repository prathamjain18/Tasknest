package com.csci3130_g15.G15_backend.controller;

import com.csci3130_g15.G15_backend.model.Board;
import com.csci3130_g15.G15_backend.model.Workspace;
import com.csci3130_g15.G15_backend.repository.BoardRepository;
import com.csci3130_g15.G15_backend.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/workspace")
public class WorkspaceController {
    @Autowired
    WorkspaceService workspaceService;

    @Autowired
    private BoardRepository boardRepository;

    @PostMapping("/save")
    public String createWorkspace (@RequestBody Workspace workspace) {
        return workspaceService.createWorkspace(workspace);
    }

    @GetMapping("/all")
    public List<Workspace> getAllWorkspaces() {
        return workspaceService.getAllWorkspaces();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workspace> getWorkspaceById (@PathVariable("id") int id) {
        Optional<Workspace> workspaceOptional = workspaceService.getWorkspaceById(id);

        if (workspaceOptional.isPresent()) {
            Workspace workspace = workspaceOptional.get();

            return ResponseEntity.ok(workspace);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
