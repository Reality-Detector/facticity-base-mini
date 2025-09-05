import React from 'react';
import { Button, Avatar, Box } from '@mui/material';
import useAuth from '../../auth/useAuthHook';
import { useNavigate } from 'react-router-dom';

const ThirdColumn = () => {
    const { loginWithPopup, logout, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await loginWithPopup();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleLogout = () => {
        logout({ returnTo: window.location.origin });
    };

    const navigateToSettings = () => {
        navigate('/settings');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                // Ensure the Box doesn't shrink and allows its content to fit
                flexShrink: 0,
            }}
        >
            {isAuthenticated ? (
                <Box
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={navigateToSettings} // Navigate on click
                >
                    <Avatar
                        src={user.picture}
                        alt={user.name}
                        sx={{ width: 40, height: 40, borderRadius: '50%', marginRight: 1 }}
                    />
                </Box>
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    size="small" // Makes the button smaller
                    sx={{
                        borderRadius: '20px', // Increases the border radius for a more rounded button
                        textTransform: 'none', // Keeps the text as is without uppercase transformation
                        backgroundColor: '#0066FF', // Sets the button color
                        fontSize: '0.875rem', // Sets a smaller font size
                        padding: '6px 16px', // Adjusts padding for a compact look
                        whiteSpace: 'nowrap', // Prevents text from wrapping
                        flexShrink: 0, // Prevents the button from shrinking
                        minWidth: 'auto', // Allows the button to size based on content
                        boxShadow: 'none', // Removes shadow
                        '&:hover': {
                            backgroundColor: '#0056d9', // Slightly darker shade on hover
                        },
                        '&:active': {
                            backgroundColor: '#0046b3', // Even darker shade for active state
                        },
                        '&:focus': {
                            outline: 'none', // Removes focus outline
                        },
                    }}
                >
                    Sign In
                </Button>


            )}
        </Box>
    );
};

export default ThirdColumn;
