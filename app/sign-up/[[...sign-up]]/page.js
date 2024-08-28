import { SignUp, SignIn } from "@clerk/nextjs";
import { AppBar, Box, Container, Typography, Button, Toolbar } from "@mui/material";
import Link from 'next/link';

export default function SignUpPage() {
    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: '100vh' }} // Optional: Ensure the content is centered vertically
            >
                <Typography variant="h4">Sign Up</Typography>
                <SignUp />
            </Box>
        </Container>
    );
}
