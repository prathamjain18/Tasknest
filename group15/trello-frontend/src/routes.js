import { useRoutes, Navigate, Route } from "react-router-dom";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Workspace from "./pages/Workspace";
import WorkspaceCreation from "./pages/WorkspaceCreation";
import Reset from "./pages/Reset";
import TestHome from "./pages/TestHome";
import TestWorkspaceCreate from "./pages/TestWorkspaceCreate";
import BoardCreation from "./pages/BoardCreation";
import BoardView from "./pages/BoardView";

export default function Router() {
  const isAuthenticated = true;
  return useRoutes([
    {
      path: "",
      element: <Navigate to={"/login"} replace />,
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "reset",
          element: <Reset />,
        },
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "workspace-creation",
          element: <WorkspaceCreation />,
        },
        {
          path: "/workspace/:workspaceID",
          element: <Workspace />
        },
        {
          path: "/workspace/:workspaceID/board-creation",
          element: <BoardCreation />
        },
        {
          path: "board-demo",
          element: <BoardView />
        },
      ],
    },
  ]);
}
