package com.csci3130_g15.G15_backend.controller;

import com.csci3130_g15.G15_backend.dtos.TaskCreationRequest;
import com.csci3130_g15.G15_backend.model.Board;
import com.csci3130_g15.G15_backend.model.Task;
import com.csci3130_g15.G15_backend.service.BoardService;
import com.csci3130_g15.G15_backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/workspace/boards/tasks")
public class TaskController {
    @Autowired
    TaskService taskService;

    @Autowired
    BoardService boardService;

    @PostMapping("/save")
    public ResponseEntity<?> createTask(@RequestBody TaskCreationRequest taskCreationRequest) {
        Optional<Board> boardOptional = boardService.getBoardById(taskCreationRequest.getBoardID());
        Task task = new Task();

        if (boardOptional.isPresent()) {
            Board board = boardOptional.get();
            LocalDate dueDate = LocalDate.parse(taskCreationRequest.getDueDate());

            task.setTaskName(taskCreationRequest.getName());
            task.setTaskStatus(taskCreationRequest.getStatus());
            task.setDueDate(dueDate);

            board.addTask(task);

            Task creationResult = taskService.createTask(task);

            return ResponseEntity.ok(creationResult);
        }else {
            return ResponseEntity.notFound().build();
        }

    }

    @PutMapping("/{taskID}/update")
    public ResponseEntity<?> updateTaskDueDate(@PathVariable("taskID") int taskID, @RequestBody Map<String, String> taskUpdate) {
        String newTaskStatus = taskUpdate.get("status");

        Optional<Task> taskOptional = taskService.getTaskById(taskID);
        if (taskOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Task task = taskOptional.get();

        task.setTaskStatus(newTaskStatus);

        try {
            Task result = taskService.updateTask(task);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating task status");
        }
    }
}
