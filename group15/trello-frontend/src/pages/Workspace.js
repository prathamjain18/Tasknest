import { Button, TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@mui/material";
import axios from "axios";

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

  // Styles for UI elements
  const memberStyle = {
    fontSize: "120%",
    fontWeight: "bold",
    color: "#555",
    margin: "8px 0",
    fontFamily: "sans-serif",
    textTransform: "uppercase",
  };

  const boardTitleStyle = {
    fontSize: "160%",
    fontWeight: "bold",
    color: "#fff",
    margin: "8px 0",
    fontFamily: "Georgia, serif",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  };

  const buttonStyle = {
    margin: "auto",
    marginTop: "3%",
    fontSize: "180%",
    display: "block",
    backgroundColor: "rgb(255, 196, 196)",
    fontFamily: "serif",
  };

  return (
    <div>
      {/* Workspace Header */}
      <div style={{ backgroundColor: "rgb(238, 105, 131)" }}>
        <h1 style={{ textAlign: "center" }}>Add boards to your workspace!</h1>
        <p style={{ textAlign: "center", fontSize: "160%" }}>
          Workspace: {workspace.workspaceName}
        </p>
      </div>

      {/* Add Member Button */}
      <button style={buttonStyle} onClick={addMember}>
        Add Member
      </button>

      {/* Display Members */}
      <div style={{ marginTop: "3%", textAlign: "center" }}>
        {members.map((member) => (
          <div key={member.id}>
            <p style={memberStyle}>{member.name}</p>
            <button onClick={() => deleteMember(member.id)}>Remove</button>
          </div>
        ))}
      </div>

      {/* Add Board Form */}
      <div style={{ textAlign: "center" }}>
        <TextField
          label="Board Name"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
        />
        <button style={buttonStyle} onClick={handleCreateBoard}>
          Add Board
        </button>
      </div>

      {/* Search Box */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <TextField
          label="Search Task Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          variant={filterType === "all" ? "contained" : "outlined"}
          onClick={() => setFilterType("all")}
          style={{ margin: "4px" }}
        >
          All Tasks
        </Button>
        <Button
          variant={filterType === "dueToday" ? "contained" : "outlined"}
          onClick={() => setFilterType("dueToday")}
          style={{ margin: "4px" }}
        >
          Due Today
        </Button>
        <Button
          variant={filterType === "dueThisWeek" ? "contained" : "outlined"}
          onClick={() => setFilterType("dueThisWeek")}
          style={{ margin: "4px" }}
        >
          Due This Week
        </Button>
        <Button
          variant={filterType === "overdue" ? "contained" : "outlined"}
          onClick={() => setFilterType("overdue")}
          style={{ margin: "4px" }}
        >
          Overdue
        </Button>
      </div>

      {/* Display Boards */}
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexWrap: "wrap",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {boards.map((board) => (
          <div
            key={board.boardID}
            style={{ flex: "0 0 calc(25% - 8px)", margin: "4px" }}
          >
            <Card
              style={{
                backgroundColor: "rgb(238, 105, 131)",
                height: "600px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent>
                {/* Board Title */}
                <p style={boardTitleStyle}>{board.boardName}</p>
                {/* Button to change board title */}
                <Button
                  style={buttonStyle}
                  onClick={() =>
                    handleBoardNameChange(board.boardID, board.boardName)
                  }
                >
                  Change Name
                </Button>
              </CardContent>
              <div style={{ padding: "8px 16px" }}>
                {/* Task Name Input */}
                <TextField
                  label="Task Name"
                  value={taskNames[board.boardID] || ""}
                  onChange={(e) =>
                    setTaskNames((prevTaskNames) => ({
                      ...prevTaskNames,
                      [board.boardID]: e.target.value,
                    }))
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 16px",
                }}
              >
                <div style={{ flex: 1, width: "50%" }}>
                  {/* Due Date Input */}
                  <TextField
                    label="Due Date"
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ flex: 1, width: "50%", marginLeft: "16px" }}>
                  {/* Assigned Member Dropdown */}
                  <TextField
                    select
                    label="Assign Member"
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    SelectProps={{
                      displayEmpty: true,
                    }}
                    style={{ width: "100%" }}
                  >
                    {members.map((member) => (
                      <MenuItem key={member.id} value={member.name}>
                        {member.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>
              {/* Add Task Button */}
              <Button
                style={buttonStyle}
                onClick={() => addTask(board.boardID, taskNames[board.boardID])}
              >
                Add Task
              </Button>
              <div style={{ flex: 1, overflowY: "scroll" }}>
                {/* Display Tasks */}
                {filteredTasks(board).map((task) => (
                  <Card
                    key={task.id}
                    style={{
                      margin: "8px 0",
                      backgroundColor: "rgb(255, 230, 230)",
                      textDecoration:
                        task.status === "completed" ? "line-through" : "none",
                    }}
                  >
                    <CardContent>
                      <p style={{ fontWeight: "bold" }}>{task.taskName}</p>
                      <p>Status: {task.taskStatus}</p>
                      <p>Due Date: {task.dueDate}</p>
                    </CardContent>
                    <Button
                      onClick={() =>
                        handleTaskStatusChange(
                          board.boardID,
                          task.id,
                          task.taskStatus === "completed"
                            ? "to-do"
                            : "completed"
                        )
                      }
                    >
                      Mark{" "}
                      {task.taskStatus === "completed" ? "To-do" : "Completed"}
                    </Button>
                  </Card>
                ))}
              </div>
              {/* Delete Board Button */}
              <Button
                style={buttonStyle}
                onClick={() => deleteBoard(board.boardID)}
              >
                Delete Board
              </Button>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
