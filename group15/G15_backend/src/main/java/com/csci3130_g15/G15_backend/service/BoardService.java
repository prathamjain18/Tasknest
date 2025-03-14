package com.csci3130_g15.G15_backend.service;

import com.csci3130_g15.G15_backend.model.Board;
import com.csci3130_g15.G15_backend.repository.BoardRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BoardService {
    @Autowired
    BoardRepository boardRepository;

    public Board createBoard(Board board) {
        if (board == null) {
            throw new IllegalArgumentException("Board cannot be null.");
        }

        return boardRepository.save(board);
    }

    public void deleteBoard(int boardID) {
        Optional<Board> boardOptional = boardRepository.findById(boardID);
        if (boardOptional.isEmpty()) {
            throw new EntityNotFoundException("Board with ID " + boardID + " not found");
        }

        boardRepository.deleteById(boardID);
    }

    public void updateBoardName(int boardID, String newBoardName) {
        Optional<Board> boardOptional = boardRepository.findById(boardID);
        if (boardOptional.isEmpty()) {
            throw new EntityNotFoundException("Board with ID " + boardID + " not found");
        }

        Board existingBoard = boardOptional.get();

        existingBoard.setBoardName(newBoardName);

        boardRepository.save(existingBoard);
    }

    public Optional<Board> getBoardById (int id) {
        return boardRepository.findByBoardID(id);
    }
}
