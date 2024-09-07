'use client';

import { useRouter } from 'next/navigation';
import { Button, Container, Typography, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // Importing the Play icon
import '@fontsource/roboto';  // Importing the Roboto font

import { useUser } from "@clerk/clerk-react";
import { push, ref } from "firebase/database";
import { useState } from 'react';
import { database } from './firebase/firebaseConfig';

export default function Home() {
    const { isSignedIn, user, isLoaded } = useUser();
    const [roomId, setRoomId] = useState('');
    const router = useRouter();

    const handleCreateRoom = () => {
        const newRoomRef = push(ref(database, 'rooms'));
        const newRoomId = newRoomRef.key;
        router.push(`/battle/${newRoomId}`);
    }

    const handleJoinRoom = () => {
        router.push(`/battle/${roomId}`);
    }

    const handleJoinGame = () => {
        router.push('/waiting');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(to bottom, #1e3c72, #2a5298)', // Blue gradient background
                color: '#fff',
                textAlign: 'center',
                fontFamily: 'Roboto, sans-serif',
                animation: 'fadeIn 2s ease-in-out', // Fade-in animation
                '@keyframes fadeIn': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
            }}
        >
            <Container maxWidth="sm">
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                    Battle Leetcode
                </Typography>
                {/* <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={handleJoinGame}
                    startIcon={<PlayArrowIcon />} // Adding a Play icon
                    sx={{
                        backgroundColor: '#ff4081',
                        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.3)',
                        ':hover': {
                            backgroundColor: '#ff1c61',
                        },
                        padding: '12px 24px',
                        fontSize: '1.2rem',
                        animation: 'bounce 2s infinite', // Bounce animation
                        '@keyframes bounce': {
                            '0%, 20%, 50%, 80%, 100%': {
                                transform: 'translateY(0)',
                            },
                            '40%': {
                                transform: 'translateY(-10px)',
                            },
                            '60%': {
                                transform: 'translateY(-5px)',
                            },
                        },
                    }}
                >
                    Join Game
                </Button> */}
                <h2 className="text-2xl">Welcome, {user?.fullName}</h2>
                <button onClick={handleCreateRoom} className="text-2xl font-bold text-blue-500 border border-blue-500 rounded px-4 py-2 hover:bg-blue-500 hover:text-white">Create Room</button>
                <p className="text-2xl">or</p>
                <input
                    className="text-2xl font-bold text-blue-500 border border-blue-500 rounded px-4 py-2"
                    type="text"
                    placeholder="Enter room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
                <button onClick={handleJoinRoom} className="text-2xl font-bold text-blue-500 border border-blue-500 rounded px-4 py-2 hover:bg-blue-500 hover:text-white">Join Room</button>
            </Container>
        </Box>
    );
}
