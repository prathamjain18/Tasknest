package com.tasknest.tasknestbackend.repository;

import com.tasknest.tasknestbackend.model.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoardRepository extends JpaRepository <Board, Integer> {
    //The BoardRepository interface extends the JpaRepository interface
    //so the CRUD operations can be used

    Optional<Board> findByBoardID(int id);
}
