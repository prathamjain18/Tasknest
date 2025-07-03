package com.tasknest.tasknestbackend.repository;

import com.tasknest.tasknestbackend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    //The TaskRepository interface extends the JpaRepository interface
    //so the CRUD operations can be used
}
