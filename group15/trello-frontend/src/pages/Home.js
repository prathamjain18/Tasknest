import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import ReactPlayer from 'react-player';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Grid,
    Box,
    IconButton,
    Tooltip,
    Container,
    Paper,
    Avatar,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

export default function Home() {
    const [workspaces, setWorkspaces] = useState([]);
    const [showGif, setShowGif] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/user/workspace/all');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setWorkspaces(data);
            } catch (error) {
                console.error('Error fetching workspaces:', error.message);
            }
        };
        fetchWorkspaces();
    }, []);

    // --- UI ---
    return (
        <Box sx={{ bgcolor: '#f7fafd', minHeight: '100vh' }}>
            {/* AppBar */}
            <AppBar position="static" color="primary" elevation={1} sx={{ mb: 4 }}>
                <Toolbar>
                    <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 900, letterSpacing: 1, fontFamily: 'Poppins, Inter, Roboto, Arial, sans-serif', color: '#fff' }}>
                        Tasknest
                    </Typography>
                    <IconButton color="inherit" component={Link} to="/logout">
                        <Logout />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md">
                <Paper elevation={1} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 3, boxShadow: 'none', bgcolor: '#fff' }}>
                    <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
                        Welcome to your workspace
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
                        Organize your projects, tasks, and teams visually and efficiently.
                    </Typography>
                    <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {/* Removed GIF and unnecessary images for minimal look */}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                                {/* Removed ReactPlayer for minimal, static UI */}
                        </Grid>
                    </Grid>
                </Paper>

                {/* Workspaces */}
                <Typography variant="h5" fontWeight={600} sx={{ mb: 2, mt: 4 }}>
                    Your Workspaces
                </Typography>
                <Grid container spacing={2}>
                    {workspaces.map((workspace) => (
                        <Grid item xs={12} sm={6} key={workspace.workspaceID}>
                            <Paper
                                component={Link}
                                to={`/workspace/${workspace.workspaceID}`}
                                elevation={1}
                                sx={{
                                    p: 3,
                                    borderRadius: 4,
                                    textDecoration: 'none',
                                    bgcolor: '#f7fafc',
                                    '&:hover': { bgcolor: '#e3f2fd' },
                                    display: 'block',
                                    boxShadow: 3,
                                }}
                            >
                                <Box display="flex" alignItems="center" mb={1}>
                                    <WorkspacePremiumIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="h6" fontWeight={500} color="primary.main">
                                        {workspace.workspaceName}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {workspace.workspaceDes}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Create Workspace Button */}
                <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            px: 3,
                            py: 1.5,
                            borderRadius: 3,
                            background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                            color: '#fff',
                            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                                color: '#fff',
                            },
                        }}
                        component={Link}
                        to="/workspace-creation"
                    >
                        Create New Workspace
                    </Button>
                </Box>

                {/* Info Section */}
                <Paper elevation={0} sx={{ mt: 6, p: 3, textAlign: 'center', bgcolor: 'transparent', boxShadow: 'none' }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Information about Tasknest
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Tasknest is a web-based project management and collaboration tool that allows individuals and teams
                        to organize tasks, projects, and workflows in a visual and flexible manner. It uses boards, lists,
                        and cards to help users manage their work and track progress.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}






