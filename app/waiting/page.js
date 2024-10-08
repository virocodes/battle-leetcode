'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@clerk/nextjs'; // Clerk auth hook
import { Container, Typography, Button, Box, CircularProgress } from "@mui/material";

export default function WaitingRoom() {
    const [players, setPlayers] = useState(1);
    const [secondsRemaining, setSecondsRemaining] = useState(5);
    const router = useRouter();
    const { isSignedIn } = useAuth(); // Check if user is signed in

    useEffect(() => {
        if (!isSignedIn) {
            router.push('/sign-in'); // Redirect to sign-in if not signed in
            return;
        }

        const interval = setInterval(() => {
            setPlayers((prev) => prev + 1); // Simulate another player joining
        }, 3000);

        if (players >= 2) {
            clearInterval(interval);

            const countdownInterval = setInterval(() => {
                setSecondsRemaining((prev) => {
                    if (prev > 1) {
                        return prev - 1;
                    } else {
                        clearInterval(countdownInterval);
                        router.push("/battle"); // Redirect to battle after countdown ends
                        return 0;
                    }
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [players, router, isSignedIn]);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                background: "linear-gradient(to bottom, #2c3e50, #4ca1af)",
                color: "#fff",
                textAlign: "center",
                fontFamily: "Roboto, sans-serif",
            }}
        >
            <Container maxWidth="sm">
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: "bold",
                        mb: 4,
                        animation: "fadeIn 2s ease-in-out",
                        "@keyframes fadeIn": {
                            "0%": { opacity: 0 },
                            "100%": { opacity: 1 },
                        },
                    }}
                >
                    Waiting for players...
                </Typography>

                <CircularProgress 
                    sx={{
                        color: "#fff",
                        mb: 3,
                    }}
                />

                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        mb: 2,
                        animation: "slideIn 2s ease-out",
                        "@keyframes slideIn": {
                            "0%": { transform: "translateX(-100%)" },
                            "100%": { transform: "translateX(0)" },
                        },
                    }}
                >
                    {players}/2 players joined
                </Typography>

                {players >= 2 && (
                    <Typography
                        variant="body1"
                        sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            animation: "pulse 2s infinite",
                            "@keyframes pulse": {
                                "0%": { opacity: 1 },
                                "50%": { opacity: 0.5 },
                                "100%": { opacity: 1 },
                            },
                        }}
                    >
                        Game starting in {secondsRemaining} seconds...
                    </Typography>
                )}

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => router.push("/")}
                    sx={{
                        marginTop: "20px",
                        backgroundColor: "#ff4081",
                        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.3)",
                        ":hover": {
                            backgroundColor: "#ff1c61",
                        },
                        padding: "12px 24px",
                        fontSize: "1.2rem",
                    }}
                >
                    Cancel
                </Button>
            </Container>
        </Box>
    );
}
                      
