package com.tasknest.tasknestbackend.controller;

import com.tasknest.tasknestbackend.dtos.BoardCreationRequest;
import com.tasknest.tasknestbackend.model.Board;
import com.tasknest.tasknestbackend.model.Workspace;
import com.tasknest.tasknestbackend.service.BoardService;
import com.tasknest.tasknestbackend.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/workspace/boards")
public class BoardController {
    @Autowired
    BoardService boardService;

    @Autowired
    WorkspaceService workspaceService;

    @PostMapping("/save")
    public ResponseEntity<?> createBoard (@RequestBody BoardCreationRequest boardCreationRequest) {
        Optional<Workspace> workspaceOptional = workspaceService.getWorkspaceById(boardCreationRequest.getWorkspaceId());
        Board board = new Board();

        if (workspaceOptional.isPresent()) {
            Workspace workspace = workspaceOptional.get();

            board.setBoardName(boardCreationRequest.getName());
            board.setWorkspace(workspace);

            workspace.addBoard(board);

            Board creationResult = boardService.createBoard(board);

            return ResponseEntity.ok(creationResult);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{boardID}")
    public ResponseEntity<?> deleteBoard(@PathVariable("boardID") int boardID) {
        Optional<Board> boardOptional = boardService.getBoardById(boardID);
        if (boardOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            boardService.deleteBoard(boardID);
            return ResponseEntity.ok("Board deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting board");
        }
    }

    @PutMapping("/{boardID}/update")
    public ResponseEntity<?> updateBoardName(@PathVariable("boardID") int boardID, @RequestBody Map<String, String> boardUpdate) {
        String newBoardName = boardUpdate.get("name");

        Optional<Board> boardOptional = boardService.getBoardById(boardID);
        if (boardOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            boardService.updateBoardName(boardID, newBoardName);
            return ResponseEntity.ok("Board name updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating board name");
        }
    }
}
