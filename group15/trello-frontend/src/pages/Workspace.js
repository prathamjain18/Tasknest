import { Button, TextField, MenuItem, Paper, Card, CardContent, Typography, Box, Grid, IconButton, Tooltip, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function WorkspacePage() {
  const { workspaceID } = useParams();
  const [workspace, setWorkspace] = useState([]);
  const [boards, setBoards] = useState([]);
  const [members, setMembers] = useState([]);
  const [boardName, setBoardName] = useState(""); // State to store the input value for creating a new board
  const [newBoardName, setNewBoardName] = useState(""); // State to store the input value for renaming a board
  const [taskNames, setTaskNames] = useState({}); // State to store the input values for task names on each board
  const [newTaskDueDate, setNewTaskDueDate] = useState(""); // State to store the input value for a new task's due date
  const [selectedMember, setSelectedMember] = useState(""); // State to store the selected member for a new task
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query for task names
  const [filterType, setFilterType] = useState("all"); // State to store the selected filter for tasks

  // Function to add a new member to the workspace
  const addMember = () => {
    const newMember = { id: Date.now(), name: "New Member" };
    setMembers((prevMembers) => [...prevMembers, newMember]);
  };

  // Function to delete a member from the workspace
  const deleteMember = (id) => {
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== id)
    );
  };

  // Function to add a new board to the workspace
  const handleCreateBoard = async () => {
    if (boardName.trim() === "") return;

    try {
      const response = await axios.post(
        `http://localhost:8080/api/user/workspace/boards/save`,
        {
          name: boardName,
          workspaceId: workspaceID,
        }
      );

      // If board creation is successful, update the boards state with the newly created board
      setBoards((prevBoards) => [...prevBoards, response.data]);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("Workspace not found:", error.response.data);
      } else {
        console.error("Error creating board:", error);
      }
    }

    setBoardName(""); // Clear the board name input field after creating a board
  };

  // Function to delete a board from the workspace
  const deleteBoard = async (boardID) => {
    try {
      // Delete the board on the server
      await axios.delete(
        `http://localhost:8080/api/user/workspace/boards/${boardID}`
      );

      // Update the boards state to remove the deleted board
      setBoards((prevBoards) =>
        prevBoards.filter((board) => board.boardID !== boardID)
      );
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  // Function to add a new task to a board
  const addTask = async (boardId, taskName) => {
    if (taskName.trim() === null) return;

    try {
      const newTask = {
        name: taskName,
        status: "to-do",
        dueDate: newTaskDueDate,
        boardID: boardId,
      };

      // Save the new task on the server
      const response = await axios.post(
        `http://localhost:8080/api/user/workspace/boards/tasks/save`,
        newTask
      );

      const createdTask = response.data;

      // Update the boards state to add the new task to the appropriate board
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.boardID === boardId
            ? { ...board, tasks: [...board.tasks, createdTask] }
            : board
        )
      );

      setTaskNames((prevTaskNames) => ({ ...prevTaskNames, [boardId]: "" }));
      setNewTaskDueDate("");
      setSelectedMember("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Function to change the name of a board
  const handleBoardNameChange = async (boardID, currentName) => {
    const newBoardName = prompt("Enter new board name:", currentName);
    if (newBoardName) {
      try {
        // Save the updated board name on the server
        await axios.put(
          `http://localhost:8080/api/user/workspace/boards/${boardID}/update`,
          {
            name: newBoardName,
          }
        );

        // Update the boards state to reflect the name change
        setBoards((prevBoards) =>
          prevBoards.map((board) =>
            board.boardID === boardID
              ? { ...board, boardName: newBoardName }
              : board
          )
        );
      } catch (error) {
        console.error("Error updating board name:", error);
      }
    }
  };

  // Function to handle task status change
  const handleTaskStatusChange = async (boardID, taskID, newStatus) => {
    try {
      // Update the task's status on the server
      await axios.put(
        `http://localhost:8080/api/user/workspace/boards/tasks/${taskID}/update`,
        {
          status: newStatus,
        }
      );

      // Update the boards state to reflect the task status change
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.boardID === boardID
            ? {
                ...board,
                tasks: board.tasks.map((task) =>
                  task.id === taskID ? { ...task, taskStatus: newStatus } : task
                ),
              }
            : board
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const today = new Date();
  const oneWeekFromToday = new Date(today);
  oneWeekFromToday.setDate(today.getDate() + 7);

  // Function to filter tasks based on the selected filter
  const filteredTasks = (board) => {
    let filtered = board.tasks;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((task) =>
        task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const today = new Date();
    const lastDayOfWeek = new Date(today);
    lastDayOfWeek.setDate(today.getDate() + (7 - today.getDay())); // Set to the last day of the week (Sunday)

    if (filterType === "dueToday") {
      filtered = filtered.filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === today.toDateString();
      });
    } else if (filterType === "dueThisWeek") {
      filtered = filtered.filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= lastDayOfWeek;
      });
    } else if (filterType === "overdue") {
      filtered = filtered.filter((task) => {
        const dueDate = new Date(task.dueDate);
        return (
          dueDate < today && dueDate.toDateString() !== today.toDateString()
        );
      });
    }

    return filtered;
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/user/workspace/${workspaceID}`)
      .then((response) => response.json())
      .then((data) => {
        setWorkspace(data);
        setBoards(data.boards); // Initialize the boards state with the boards from the fetched data
      })
      .catch((error) => {
        console.error("Error fetching workspace:", error);
      });
  }, [workspaceID]);

  if (!workspace) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f7fafc 0%, #e3f0ff 100%)', p: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center" sx={{ mb: 4 }}>
          Workspace
        </Typography>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" fontWeight={600}>
              Boards
            </Typography>
            <Box display="flex" alignItems="center">
              <TextField
                label="New Board Name"
                size="small"
                value={boardName}
                onChange={e => setBoardName(e.target.value)}
                sx={{ mr: 2, minWidth: 200 }}
              />
              <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreateBoard} sx={{ borderRadius: 2, fontWeight: 600 }}>
                Add Board
              </Button>
            </Box>
          </Box>
          <Grid container spacing={3}>
            {boards.map(board => (
              <Grid item xs={12} sm={6} md={4} key={board.boardID}>
                <Card elevation={2} sx={{ borderRadius: 3, p: 2, bgcolor: '#fff', boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="h6" fontWeight={600} color="primary.main">
                        {board.boardName}
                      </Typography>
                      <Box>
                        <Tooltip title="Edit Board Name">
                          <IconButton size="small" color="primary" onClick={() => handleBoardNameChange(board.boardID, board.boardName)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Board">
                          <IconButton size="small" color="error" onClick={() => deleteBoard(board.boardID)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    {/* Task List */}
                    <Box mt={2}>
                      <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                        Tasks
                      </Typography>
                      <Box display="flex" alignItems="center" mb={1}>
                        <TextField
                          label="New Task"
                          size="small"
                          value={taskNames[board.boardID] || ''}
                          onChange={e => setTaskNames({ ...taskNames, [board.boardID]: e.target.value })}
                          sx={{ mr: 1 }}
                        />
                        <TextField
                          label="Due Date"
                          type="date"
                          size="small"
                          value={newTaskDueDate}
                          onChange={e => setNewTaskDueDate(e.target.value)}
                          sx={{ mr: 1 }}
                          InputLabelProps={{ shrink: true }}
                        />
                        <Button variant="contained" color="success" size="small" onClick={() => addTask(board.boardID, taskNames[board.boardID])} sx={{ borderRadius: 2 }}>
                          Add
                        </Button>
                      </Box>
                      {/* Task Filtering */}
                      <TextField
                        label="Search Tasks"
                        size="small"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        sx={{ mb: 1, width: '100%' }}
                      />
                      <TextField
                        select
                        label="Filter"
                        size="small"
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        sx={{ mb: 2, width: '100%' }}
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="dueToday">Due Today</MenuItem>
                        <MenuItem value="dueThisWeek">Due This Week</MenuItem>
                        <MenuItem value="overdue">Overdue</MenuItem>
                      </TextField>
                      <Box>
                        {filteredTasks(board).map(task => (
                          <Paper key={task.id} elevation={1} sx={{ p: 1.5, mb: 1, borderRadius: 2, bgcolor: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography fontWeight={500}>{task.taskName}</Typography>
                              <Typography variant="caption" color="text.secondary">Due: {task.dueDate}</Typography>
                            </Box>
                            <TextField
                              select
                              size="small"
                              value={task.taskStatus}
                              onChange={e => handleTaskStatusChange(board.boardID, task.id, e.target.value)}
                              sx={{ minWidth: 100 }}
                            >
                              <MenuItem value="to-do">To Do</MenuItem>
                              <MenuItem value="in-progress">In Progress</MenuItem>
                              <MenuItem value="done">Done</MenuItem>
                            </TextField>
                          </Paper>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
        {/* Members Section */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Members
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={addMember} sx={{ borderRadius: 2, fontWeight: 600, mr: 2 }}>
              Add Member
            </Button>
            <TextField label="Search Members" size="small" sx={{ minWidth: 200 }} />
          </Box>
          <Grid container spacing={2}>
            {members.map(member => (
              <Grid item xs={12} sm={6} md={4} key={member.id}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography>{member.name}</Typography>
                  <IconButton color="error" onClick={() => deleteMember(member.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
