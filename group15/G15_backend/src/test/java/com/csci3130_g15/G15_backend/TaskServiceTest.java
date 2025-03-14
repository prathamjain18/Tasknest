package com.csci3130_g15.G15_backend;

import com.csci3130_g15.G15_backend.model.Task;
import com.csci3130_g15.G15_backend.repository.TaskRepository;
import com.csci3130_g15.G15_backend.service.TaskService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class TaskServiceTest {
    @Mock
    private TaskRepository taskRepository;
    @InjectMocks
    private TaskService taskService;

    @Test
    public void createTaskTest_validTask() {
        Task task = new Task();

        task.setTaskName("Create unit tests");
        task.setTaskStatus("Open");
        task.setDueDate(LocalDate.now());
        task.setUsers(new ArrayList<>());

        when(this.taskRepository.save(task)).thenReturn(task);

        Task savedTask = this.taskService.createTask(task);

        Assert.assertEquals(task, savedTask);

        verify(this.taskRepository).save(task);
    }

    @Test
    public void createTaskTest_InvalidDate() {
        Task task = new Task();

        task.setTaskName("Create unit tests");
        task.setTaskStatus("Open");
        task.setDueDate(LocalDate.of(2022, 12, 31));
        task.setUsers(new ArrayList<>());

        ResponseStatusException exception = Assert.assertThrows(
                ResponseStatusException.class,
                () -> this.taskService.createTask(task)
        );

        Assert.assertEquals("Invalid due date.", exception.getReason());
    }

    @Test
    public void updateTask_ValidDate() {
        Task task = new Task();
        task.setId(1);
        task.setTaskName("Create unit tests");
        task.setTaskStatus("To-Do");
        task.setDueDate(LocalDate.of(2023, 7, 16));
        task.setUsers(new ArrayList<>());

        Task updatedTask = new Task();
        updatedTask.setId(1);
        updatedTask.setTaskName("Create unit tests");
        updatedTask.setTaskStatus("To-Do");
        updatedTask.setDueDate(LocalDate.of(2023, 7, 25));
        updatedTask.setUsers(new ArrayList<>());

        when(this.taskRepository.findById(1)).thenReturn(Optional.of(task));
        when(this.taskRepository.save(task)).thenReturn(updatedTask);

        this.taskService.updateTask(updatedTask);

        boolean result = task.getDueDate().equals(updatedTask.getDueDate());

        Assert.assertTrue(result);

        verify(this.taskRepository).findById(1);
        verify(this.taskRepository).save(task);
    }

    @Test
    public void updateTask_StatusChange() {
        Task task = new Task();
        task.setId(1);
        task.setTaskName("Create unit tests");
        task.setTaskStatus("To-Do");
        task.setDueDate(LocalDate.of(2023, 7, 16));
        task.setUsers(new ArrayList<>());

        Task updatedTask = new Task();
        updatedTask.setId(1);
        updatedTask.setTaskName("Create unit tests");
        updatedTask.setTaskStatus("Doing");
        updatedTask.setDueDate(LocalDate.of(2023, 7, 16));
        updatedTask.setUsers(new ArrayList<>());

        when(this.taskRepository.findById(1)).thenReturn(Optional.of(task));
        when(this.taskRepository.save(task)).thenReturn(updatedTask);

        this.taskService.updateTask(updatedTask);

        boolean result = task.getTaskStatus().equals(updatedTask.getTaskStatus());

        Assert.assertTrue(result);

        verify(this.taskRepository).findById(1);
        verify(this.taskRepository).save(task);
    }

    @Test
    public void updateTask_NameChange() {
        Task task = new Task();
        task.setId(1);
        task.setTaskName("Create unit tests");
        task.setTaskStatus("To-Do");
        task.setDueDate(LocalDate.of(2023, 7, 16));
        task.setUsers(new ArrayList<>());

        Task updatedTask = new Task();
        updatedTask.setId(1);
        updatedTask.setTaskName("Create more unit tests");
        updatedTask.setTaskStatus("To-Do");
        updatedTask.setDueDate(LocalDate.of(2023, 7, 16));
        updatedTask.setUsers(new ArrayList<>());

        when(this.taskRepository.findById(1)).thenReturn(Optional.of(task));
        when(this.taskRepository.save(task)).thenReturn(updatedTask);

        this.taskService.updateTask(updatedTask);

        boolean result = false;

        if (task.getTaskName().equals(updatedTask.getTaskName())) {
            result = true;
        }

        Assert.assertTrue(result);

        verify(this.taskRepository).findById(1);
        verify(this.taskRepository).save(task);
    }

    @Test
    public void testGetTaskById_TaskExists() {
        int taskId = 1;
        Task task = new Task();

        task.setId(taskId);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

        Optional<Task> result = taskService.getTaskById(taskId);

        Assert.assertTrue(result.isPresent());
        Assert.assertEquals(task, result.get());
        verify(taskRepository).findById(taskId);
    }

    @Test
    public void testGetTaskById_TaskNotExists() {
        int taskId = 1;

        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        Optional<Task> result = taskService.getTaskById(taskId);

        Assert.assertFalse(result.isPresent());
        verify(taskRepository).findById(taskId);
    }
}
