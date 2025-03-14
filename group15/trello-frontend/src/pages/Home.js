import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import ReactPlayer from 'react-player';
import CloseIcon from '@mui/icons-material/Close';
import {
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Container,
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';

import buttonHoverSound from '../Sound/123.mp3'; // Import the sound file

export default function Home() {
    const [workspaces, setWorkspaces] = useState([]);
    const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
    const [showGif, setShowGif] = useState(false);
    const [audioElement, setAudioElement] = useState(null); // State for audio element

    // Function to play the sound on button click
    const playButtonHoverSound = () => {
        if (audioElement) {
            audioElement.play().catch((error) => {
                // Handle any errors during playback (e.g., user interaction requirement)
                console.error('Error playing sound:', error);
            });
        }
    };

    //getting all workspaces
    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/user/workspace/all');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setWorkspaces(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching workspaces:', error.message);
            }
        };

        /*fetch('http://localhost:8080/api/user/workspace/all')
            .then((response) => response.json())
            .then((data) => {
                setWorkspaces(data);
                console.log(data);
            })
            .catch((error) => {
                console.error('Error fetching workspaces:', error);
            });*/

        fetchWorkspaces();

        // Create the audio element and store it in the state
        const audio = new Audio(buttonHoverSound);
        setAudioElement(audio);
    }, []);

    // Tooltip content
    const tooltipText = 'Do you have any questions? please contact us!';

    // Gif image URL
    const gifImageUrl = process.env.PUBLIC_URL + '/img3.gif';

    return (
        <Container maxWidth={false}>
            <Box display="flex" justifyContent="flex-end" mt={2}>
                <IconButton
                    onClick={() => console.log('Logout clicked')}
                    style={{
                        backgroundColor: '#0079bf',
                        color: 'white',
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: '999',
                    }}
                >
                    <Logout />
                </IconButton>
            </Box>
            <Box my={4} margin="200px">
                <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    fontWeight="bold"
                    style={{
                        backgroundColor: '#F39652',
                        fontFamily: 'monospace',
                        textAlign: 'center',
                        color: 'white',
                        fontSize: '2.5rem',
                        padding: '1rem',
                        marginTop: '4rem',
                    }}
                >
                    Home
                </Typography>
                <Typography
                    variant="h2"
                    component="h2"
                    align="center"
                    style={{
                        backgroundColor: '#BA55DC',
                        fontFamily: 'monospace',
                        textAlign: 'center',
                        color: 'white',
                        padding: '1rem',
                        fontSize: '2rem',
                        marginBottom: '2rem',
                    }}
                >
                    Enjoy your work!
                </Typography>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={4}
                    margin="20px"
                    width="100%"
                >
                    {/* Floating image on the left side */}
                    <Box
                        position="fixed"
                        bottom="600px"
                        left="50px"
                        zIndex={999}
                        transform="rotate(-10deg)" // Add rotation for a dynamic look
                        transition="transform 0.3s ease-in-out" // Add transition for smooth effect
                    >
                        <Tooltip title={tooltipText} arrow>
                            <img
                                src={process.env.PUBLIC_URL + '/question2.gif'}
                                alt="Floating Image"
                                style={{
                                    width: '120px',
                                    height: 'auto',
                                    borderRadius: '50%', // Rounded corners
                                    boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)', // Add a subtle shadow
                                    border: '2px solid #0079bf', // Add a border
                                    cursor: 'pointer', // Show pointer cursor on hover
                                    transition: 'box-shadow 0.3s ease-in-out', // Add transition for shadow effect
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.boxShadow = '0 0 12px rgba(0, 0, 0, 0.5)'; // Change shadow on hover
                                    e.target.style.transform = 'rotate(-20deg) scale(1.05)'; // Rotate and scale on hover
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.boxShadow = '0 0 8px rgba(0, 0, 0, 0.3)'; // Reset shadow on leave
                                    e.target.style.transform = 'rotate(-10deg)'; // Reset rotation on leave
                                }}
                            />
                        </Tooltip>
                    </Box>

                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
                        {/* Add effects to the "img2.png" image */}
                        <img
                            src={process.env.PUBLIC_URL + '/img2.png'}
                            alt="Image 1"
                            style={{
                                width: '100%',
                                height: 'auto',
                                filter: showGif ? 'brightness(110%)' : 'none', // Apply highlight effect when GIF is shown
                                transform: showGif ? 'scale(1.05)' : 'none', // Scale the image when GIF is shown
                                borderRadius: showGif ? '10px' : '0', // Add slight border-radius when GIF is shown
                                transition: 'filter 0.3s ease-in-out, transform 0.3s ease-in-out, border-radius 0.3s ease-in-out', // Add transitions for the effects
                            }}
                        />
                        {/* Add an overlay on hover */}
                        {showGif && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slightly transparent white overlay for highlight effect
                                }}
                            />
                        )}
                    </div>

                    <ReactPlayer
                        url="https://www.youtube.com/watch?v=fBwJEfhPUYM"
                        width="60%"
                        height="auto"
                        controls={true}
                    />
                </Box>

                {workspaces.map((workspace) => (
                    <Link
                        to={`/workspace/${workspace.workspaceID}`}
                        key={workspace.workspaceID}
                    >
                        <div
                            key={workspace.workspaceID}
                            style={{
                                margin: '1.5rem',
                                border: '2px ridge #000000',
                                padding: '1.5rem',
                                textAlign: 'center',
                                backgroundColor: '#0079bf',
                            }}
                        >
                            <Typography
                                variant="h5"
                                component="h2"
                                style={{
                                    backgroundColor: '#c1e1ec',
                                    marginBottom: '1rem',
                                    padding: '0.5rem',
                                    fontSize: '1.5rem',
                                }}
                            >
                                {workspace.workspaceName}
                            </Typography>
                            <p
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: '1.5rem',
                                    textAlign: 'center',
                                    color: 'white',
                                }}
                            >
                                {workspace.workspaceDes}
                            </p>
                        </div>
                    </Link>
                ))}

                <Box display="flex" justifyContent="center" mt={2}>
                    {/* Add Tooltip for the "Create new workspace" button */}
                    <Tooltip
                        open={showGif}
                        onClose={() => setShowGif(false)}
                        onOpen={() => setShowGif(true)}
                        title="Create new workspace"
                        arrow
                    >
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: '#32CD32',
                                fontFamily: 'monospace',
                                textAlign: 'center',
                                fontSize: '1.5rem',
                                width: '800px',
                                marginTop: '2rem',
                                marginBottom: '2rem',
                                padding: '1rem',
                            }}
                            component={Link}
                            to="/workspace-creation"
                            onMouseEnter={playButtonHoverSound} // Play sound on button hover
                            onMouseLeave={() => audioElement?.pause()} // Pause sound on button leave
                        >
                            Create new workspace
                        </Button>
                    </Tooltip>
                </Box>
                {/* Box to show the GIF image when tooltip is open */}
                {showGif && (
                    <Box position="absolute" bottom="-180px" left="950px" zIndex={9999}>
                        <img
                            src={gifImageUrl}
                            alt="GIF Image"
                            style={{ width: '200px', height: 'auto' }}
                        />
                    </Box>
                )}
            </Box>

            {/* Image and Text at the bottom of the page */}
            <Box my={4} textAlign="center" marginTop="20px">
                <img
                    src={process.env.PUBLIC_URL + '/img1.png'}
                    alt="Image 1"
                    style={{
                        width: '200px',
                        height: 'auto',
                        borderRadius: '50%', /* Rounded corners */
                        boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)', /* Add a subtle shadow */
                        marginTop: '-50px', /* Move the image slightly up */
                    }}
                />
                <Typography
                    variant="h6"
                    style={{
                        fontFamily: 'monospace',
                        fontSize: '1.5rem',
                        color: '#333',
                        marginBottom: '8px',
                    }}
                >
                    Information about Tasknest
                </Typography>
                <Typography
                    variant="body1"
                    style={{
                        fontFamily: 'monospace',
                        fontSize: '1.2rem',
                        color: '#555',
                    }}
                >
                    Tasknest is a web-based project management and collaboration tool that allows individuals and teams
                    to organize tasks, projects, and workflows in a visual and flexible manner. It uses boards, lists,
                    and cards to help users manage their work and track progress.

                </Typography>
            </Box>
        </Container>
    );
}






