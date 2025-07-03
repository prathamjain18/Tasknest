package com.tasknest.tasknestbackend.controller;

import com.tasknest.tasknestbackend.model.Board;
import com.tasknest.tasknestbackend.model.Workspace;
import com.tasknest.tasknestbackend.repository.BoardRepository;
import com.tasknest.tasknestbackend.service.WorkspaceService;
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
    public ResponseEntity<?> createWorkspace (@RequestBody Workspace workspace) {
        try {
            System.out.println("Received workspace: name='" + workspace.getWorkspaceName() + "', des='" + workspace.getWorkspaceDes() + "'");
            if (workspace.getWorkspaceName() == null || workspace.getWorkspaceName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Workspace name is required.");
            }
            String result = workspaceService.createWorkspace(workspace);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating workspace: " + e.getMessage());
        }
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
