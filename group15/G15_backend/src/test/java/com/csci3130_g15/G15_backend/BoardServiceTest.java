package com.csci3130_g15.G15_backend;

import com.csci3130_g15.G15_backend.model.Board;
import com.csci3130_g15.G15_backend.model.Workspace;
import com.csci3130_g15.G15_backend.repository.BoardRepository;
import com.csci3130_g15.G15_backend.service.BoardService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class BoardServiceTest {
    @Mock
    private BoardRepository boardRepository;

    @InjectMocks
    private BoardService boardService;

    @Test
    public void testCreateBoard_SuccessfulCreation() {
        Board inputBoard = new Board();
        inputBoard.setBoardName("Sample board");

        when(this.boardRepository.save(inputBoard)).thenReturn(inputBoard);

        Board savedBoard = this.boardService.createBoard(inputBoard);

        Assert.assertEquals(inputBoard, savedBoard);
        verify(this.boardRepository).save(inputBoard);
    }

    @Test
    public void testCreateBoard_NullBoard() {
        Board board = null;

        Assert.assertThrows(IllegalArgumentException.class, () -> this.boardService.createBoard(board));
    }

    @Test
    public void testDeleteBoard_BoardExists() {
        int boardId = 1;
        String boardName = "Sample board";
        Board board = new Board();

        board.setBoardID(boardId);
        board.setBoardName(boardName);

        when(this.boardRepository.findById(boardId)).thenReturn(Optional.of(board));

        this.boardService.deleteBoard(boardId);

        verify(this.boardRepository).deleteById(boardId);
    }

    @Test(expected = EntityNotFoundException.class)
    public void testDeleteBoard_BoardNotExists() {
        int boardId = 1;

        when(this.boardRepository.findById(boardId)).thenReturn(Optional.empty());

        this.boardService.deleteBoard(boardId);
    }

    @Test
    public void testUpdateBoardName_BoardExists() {
        int boardId = 1;
        String boardName = "Old board";
        String newBoardName = "New Board";

        Board board = new Board();

        board.setBoardID(boardId);
        board.setBoardName(boardName);

        when(this.boardRepository.findById(boardId)).thenReturn(Optional.of(board));
        when(this.boardRepository.save(board)).thenReturn(board);

        this.boardService.updateBoardName(boardId, newBoardName);

        Assert.assertEquals(newBoardName, board.getBoardName());
        verify(boardRepository).save(board);
    }

    @Test(expected = EntityNotFoundException.class)
    public void testUpdateBoardName_BoardNotExists() {
        int boardId = 1;
        String boardName = "Old board";
        String newBoardName = "New Board";

        when(this.boardRepository.findById(boardId)).thenReturn(Optional.empty());

        this.boardService.updateBoardName(boardId, newBoardName);
    }

    /*@Test
    public void testGetBoardByWorkspace_BoardFound() {
        // Prepare test data
        Workspace workspace = new Workspace("test", "Sample Workspace");
        Board board = new Board("Board 1");

        // Mock the behavior of BoardRepository.findByWorkspace()
        when(boardRepository.findByWorkspace(Optional.of(workspace))).thenReturn(Optional.of(board));

        // Call the service method
        Optional<Board> result = boardService.getBoardByWorkspace(Optional.of(workspace));

        // Assert the result
        Assert.assertTrue(result.isPresent());
        Assert.assertEquals(board, result.get());
    }

    @Test
    public void testGetBoardByWorkspace_NoBoardFound() {
        // Prepare test data
        Workspace workspace = new Workspace("test", "Sample Workspace");

        // Mock the behavior of BoardRepository.findByWorkspace()
        when(boardRepository.findByWorkspace(Optional.of(workspace))).thenReturn(Optional.empty());

        // Call the service method
        Optional<Board> result = boardService.getBoardByWorkspace(Optional.of(workspace));

        // Assert the result
        Assert.assertFalse(result.isPresent());
    }*/
}
