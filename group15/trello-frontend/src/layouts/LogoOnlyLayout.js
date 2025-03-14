import { Outlet } from "react-router-dom";
import { Typography } from "@mui/material";

export default function LogoOnlyLayout() {
    return (
        <>
            <Typography
                variant="h2"
                style={{
                    fontFamily: "cursive",
                    fontSize: "3rem",
                    fontWeight: "bold",
                    color: "#0079bf",
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    textShadow: "2px 2px 0px #000, -2px 2px 0px #000, 2px -2px 0px #000, -2px -2px 0px #000",
                }}
            >
                Tasknest
            </Typography>
            <Outlet />
        </>
    );
}


