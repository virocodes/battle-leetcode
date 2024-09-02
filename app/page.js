'use client';

import { useRouter } from 'next/navigation';
import { Button, Container, Typography, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // Importing the Play icon
import '@fontsource/roboto';  // Importing the Roboto font

export default function HomePage() {
    const router = useRouter();

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
                <Button
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
                </Button>
            </Container>
        </Box>
    );
}
