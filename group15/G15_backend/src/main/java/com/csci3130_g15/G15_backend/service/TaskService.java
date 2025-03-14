package com.csci3130_g15.G15_backend.service;

import com.csci3130_g15.G15_backend.model.Task;
import com.csci3130_g15.G15_backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    TaskRepository taskRepository;

    public Task createTask(Task task) throws ResponseStatusException {
        if (task.getDueDate().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Invalid due date.");
        }

        Task savedTask = this.taskRepository.save(task);

        return savedTask;
    }

    public Task updateTask(Task task) {
        Optional<Task> fetchedTask = this.taskRepository.findById(task.getId());

        Task oldTask = fetchedTask.get();

        if (!oldTask.getTaskName().equals(task.getTaskName())) {
            oldTask.setTaskName(task.getTaskName());
        }

        if (!oldTask.getTaskStatus().equals(task.getTaskStatus())) {
            oldTask.setTaskStatus(task.getTaskStatus());
        }

        if (!oldTask.getDueDate().equals(task.getDueDate())) {
            oldTask.setDueDate(task.getDueDate());
        }

        return this.taskRepository.save(oldTask);
    }

    public Optional<Task> getTaskById (int id) {
        return taskRepository.findById(id);
    }
}