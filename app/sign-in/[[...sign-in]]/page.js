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
            >
                <Typography variant="h4">Sign In</Typography>
                <SignIn />
            </Box>
        </Container>
    );
}
