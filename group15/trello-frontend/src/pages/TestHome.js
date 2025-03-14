import { Link, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from "react-router-dom";


const HomePage = () => {
    const [workspaces, setWorkspaces] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/user/workspace/all')
            .then(response => response.json())
            .then(data => {
                setWorkspaces(data);
                console.log(data);
                console.log(workspaces);
            })
            .catch(error => {
                console.error('Error fetching workspaces:', error);
            });
    }, []);

    return (
        <div>
            <h1>Workspaces</h1>

            <Typography>
                <Link component={RouterLink} to="/test-workspace-create" className="link">
                    <button>+</button>
                </Link>
            </Typography>

            <>
                {workspaces.map(workspace => (
                    <div key={workspace.workspaceID}>
                        <h2>{workspace.workspaceName}</h2>
                        <p>{workspace.workspaceDes}</p>
                    </div>
                ))}
            </>
        </div>
    );
};

export default HomePage;