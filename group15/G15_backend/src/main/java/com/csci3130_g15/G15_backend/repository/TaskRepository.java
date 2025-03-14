package com.csci3130_g15.G15_backend.repository;

import com.csci3130_g15.G15_backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    //The TaskRepository interface extends the JpaRepository interface
    //so the CRUD operations can be used
}
