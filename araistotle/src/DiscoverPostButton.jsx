import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    CircularProgress,
    Divider,
    IconButton,
    Alert,
    Fade,
    Paper,
    InputAdornment,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Zoom,
    Grow
} from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './AppProvider';
const TASK_ACTIONS_FEEDBACK_COLOR = '#0066FF';

const DiscoverPostButton = ({ userEmail, backendUrl, open: externalOpen, onClose: externalOnClose, onPostSuccess }) => {
    const navigate = useNavigate();
    const [internalOpen, setInternalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [postData, setPostData] = useState({
        title: '',
        description: '',
        selectedQuery: ''
    });
    const [userHandle, setUserHandle] = useState('');
    const [handleExists, setHandleExists] = useState(null);
    const [handleLoading, setHandleLoading] = useState(false);
    const [handleError, setHandleError] = useState('');
    const [handleErrorDetails, setHandleErrorDetails] = useState('');
    const [handleInput, setHandleInput] = useState('');
    const [isHandleValid, setIsHandleValid] = useState(false);
    const [handleSuggestions, setHandleSuggestions] = useState([]);


    const { currentConversation, email, postClaims, accessToken} = useAppContext();

    console.log({postClaims})

    // Use external or internal state based on props
    const dialogOpen = externalOpen !== undefined ? externalOpen : internalOpen;
    const handleDialogClose = () => {
        if (externalOnClose) {
            externalOnClose();
        } else {
            setInternalOpen(false);
        }
        // Reset form data when dialog is closed
        setPostData({
            title: '',
            description: '',
            selectedQuery: ''
        });
    };

    const handleDialogOpen = () => {
        if (externalOpen === undefined) {
            setInternalOpen(true);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPostData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Check handle existence when dialog opens
    useEffect(() => {
        if (dialogOpen) {
            checkUserHandle();
        }
    }, [dialogOpen]);

    // Set default selected query when postClaims are available
    useEffect(() => {
        if (postClaims && postClaims.length > 0 && !postData.selectedQuery) {
            setPostData(prev => ({
                ...prev,
                selectedQuery: postClaims[0]
            }));
        }
    }, [postClaims]);

    const checkUserHandle = async () => {
        setHandleLoading(true);
        setHandleError('');
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
                headers['Validator'] = 'privy';
            }
            
            const response = await fetch(`${backendUrl}/api/get_userhandle?email=${userEmail}`, {
                method: 'GET',
                headers: headers,
            });
            const data = await response.json();
            if (data.handle) {
                setUserHandle(data.handle);
                setHandleExists(true);
            } else {
                setHandleExists(false);
            }
        } catch (error) {
            console.error('Error checking user handle:', error);
            setHandleError('Failed to check user handle');
        } finally {
            setHandleLoading(false);
        }
    };

    const validateHandle = (handle) => {
        // Basic validation: 3-20 chars, alphanumeric and underscores only
        return /^[a-zA-Z0-9_]{3,20}$/.test(handle);
    };

    const handleHandleInputChange = (e) => {
        const newHandle = e.target.value;
        setHandleInput(newHandle);
        setIsHandleValid(validateHandle(newHandle));
    };

    const generateSuggestions = () => {
        const base = userEmail.split('@')[0];
        const suggestions = [
            `${base}_${Math.floor(Math.random() * 1000)}`,
            `anon_${Math.floor(Math.random() * 10000)}`,
            `user_${Math.floor(Math.random() * 100000)}`,
            `${base}_${Math.floor(Math.random() * 100)}_${Math.floor(Math.random() * 100)}`
        ];
        setHandleSuggestions(suggestions);
    };

    const generateUserHandle = async () => {
        if (!isHandleValid) return;
        
        setHandleLoading(true);
        setHandleError('');
        setHandleErrorDetails('');
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }
            
            const response = await fetch(`${backendUrl}/api/generate_userhandle`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ 
                    email: userEmail,
                    requested_handle: handleInput 
                }),
            });
            const data = await response.json();
            if (data.handle) {
                setUserHandle(data.handle);
                setHandleExists(true);
            } else {
                setHandleError(data.error || 'Failed to generate handle');
                if (data.error_details) {
                    setHandleErrorDetails(data.error_details);
                }
            }
        } catch (error) {
            console.error('Error generating user handle:', error);
            setHandleError('Failed to generate handle');
        } finally {
            setHandleLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!postData.selectedQuery) {
            return;
        }

        if (!handleExists) {
            setHandleError('Please generate a handle before posting');
            return;
        }

        setLoading(true);
        try {
            const postPayload = {
                post_id: currentConversation,
                user_email: userEmail,
                publish_time: new Date().toISOString(),
                publish_name: userHandle,
                title: postData.title.trim() || '',
                description: postData.description.trim() || '',
                is_anonymous: true,
                query: postData.selectedQuery
            };

            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
                headers['Validator'] = 'privy';
            }
            
            const response = await fetch(`${backendUrl}/api/publish_post`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(postPayload),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            setSuccess(true);
            // Call onPostSuccess after successful post
            if (onPostSuccess) {
                onPostSuccess();
            }
            setTimeout(() => {
                handleDialogClose();
                navigate('/discover/my-posts');
            }, 1500);
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {externalOpen === undefined && (
                <Box 
                    component="span" 
                    onClick={handleDialogOpen}
                    sx={{ 
                        fontSize: '0.85rem', 
                        color: TASK_ACTIONS_FEEDBACK_COLOR, 
                        fontWeight: 'bold',
                        border: `1px dashed ${TASK_ACTIONS_FEEDBACK_COLOR}`,
                        borderRadius: '20px',
                        padding: '1px 12px',
                        height: '22px',
                        backgroundColor: 'rgba(0, 102, 255, 0.08)',
                        boxShadow: '0 2px 4px rgba(0, 102, 255, 0.1)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0, 102, 255, 0.2)',
                            backgroundColor: 'rgba(0, 102, 255, 0.12)',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        }
                    }}
                >
                    <PostAddIcon sx={{ fontSize: '0.9rem' }} />
                    +2 Credits Create a Post
                </Box>
            )}

            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        maxWidth: { xs: '500px', md: '700px' },
                        width: '100%',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        transform: success ? 'scale(0.95)' : 'scale(1)',
                        boxShadow: '0 8px 32px rgba(0, 102, 255, 0.12)',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                    }
                }}
            >
                {success ? (
                    <Box sx={{ 
                        p: { xs: 4, md: 6 }, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: { xs: '300px', md: '400px' },
                        background: 'linear-gradient(135deg, #0066FF 0%, #0052cc 100%)',
                        color: 'white'
                    }}>
                        <Zoom in={true}>
                            <EmojiEventsIcon sx={{ fontSize: { xs: 80, md: 100 }, mb: 3 }} />
                        </Zoom>
                        <Grow in={true} timeout={1000}>
                            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                                Post Created Successfully!
                            </Typography>
                        </Grow>
                        <Grow in={true} timeout={1500}>
                            <Typography variant="h6" sx={{ textAlign: 'center', opacity: 0.9 }}>
                                Redirecting to discover page...
                            </Typography>
                        </Grow>
                    </Box>
                ) : (
                    <>
                        <DialogTitle sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: { xs: '20px 24px', md: '24px 32px' },
                            color: '#1a73e8',
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                            borderBottom: '1px solid rgba(0, 102, 255, 0.1)'
                        }}>
                            Create a Post
                            <IconButton
                                edge="end"
                                onClick={handleDialogClose}
                                aria-label="close"
                                sx={{ 
                                    color: 'rgba(0, 0, 0, 0.54)',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'rotate(90deg)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ 
                            p: { xs: 3, md: 4 },
                            '&.MuiDialogContent-root': {
                                paddingTop: { xs: 3, md: 4 }
                            }
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: { xs: '24px', md: '32px' },
                                background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.08) 0%, rgba(0, 102, 255, 0.04) 100%)',
                                p: { xs: 2, md: 3 },
                                borderRadius: '16px',
                                boxShadow: '0 2px 8px rgba(0, 102, 255, 0.06)'
                            }}>
                                <Typography variant="body1" sx={{ 
                                    color: '#666',
                                    fontSize: { xs: '0.875rem', md: '1rem' }
                                }}>
                                    Share your thoughts with the community:
                                </Typography>
                                <Box component="span" sx={{
                                    fontSize: { xs: '0.85rem', md: '0.9rem' },
                                    color: TASK_ACTIONS_FEEDBACK_COLOR,
                                    fontWeight: 'bold',
                                    border: `1px solid ${TASK_ACTIONS_FEEDBACK_COLOR}`,
                                    borderRadius: '20px',
                                    padding: { xs: '3px 12px', md: '4px 16px' },
                                    backgroundColor: 'rgba(0, 102, 255, 0.08)',
                                    boxShadow: '0 2px 6px rgba(0, 102, 255, 0.15)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 8px rgba(0, 102, 255, 0.2)'
                                    }
                                }}>
                                    +4 Credits
                                </Box>
                            </Box>

                            <FormControl fullWidth sx={{ mb: { xs: 3, md: 4 } }}>
                                <InputLabel id="query-select-label" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                    Which fact check would you like to highlight?
                                </InputLabel>
                                <Select
                                    labelId="query-select-label"
                                    value={postData.selectedQuery}
                                    label="Which fact check would you like to highlight?"
                                    onChange={(e) => setPostData(prev => ({ ...prev, selectedQuery: e.target.value }))}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(0, 102, 255, 0.3)',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: TASK_ACTIONS_FEEDBACK_COLOR,
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: TASK_ACTIONS_FEEDBACK_COLOR,
                                        },
                                        transition: 'all 0.3s ease',
                                        fontSize: { xs: '0.875rem', md: '1rem' }
                                    }}
                                >
                                    {postClaims && postClaims.map((query, index) => {
                                        const match = query?.match(/^timestamp-([\d:]+)\s(.*)$/);
                                        const timestamp = match ? match[1] : '';
                                        const factText = match ? match[2] : query || '';
                                        
                                        return (
                                            <MenuItem key={index} value={query} sx={{ py: 1.5 }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    {timestamp && (
                                                        <Typography variant="caption" sx={{ 
                                                            color: 'text.secondary', 
                                                            fontSize: { xs: '0.75rem', md: '0.8rem' } 
                                                        }}>
                                                            {timestamp}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="body2" sx={{ 
                                                        color: 'text.primary',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        fontSize: { xs: '0.875rem', md: '1rem' }
                                                    }}>
                                                        {factText}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Title (optional)"
                                name="title"
                                value={postData.title}
                                onChange={handleInputChange}
                                margin="normal"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        '&:hover fieldset': {
                                            borderColor: TASK_ACTIONS_FEEDBACK_COLOR,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: TASK_ACTIONS_FEEDBACK_COLOR,
                                        },
                                        transition: 'all 0.3s ease',
                                        fontSize: { xs: '0.875rem', md: '1rem' }
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: { xs: '0.875rem', md: '1rem' }
                                    }
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Description (optional)"
                                name="description"
                                value={postData.description}
                                onChange={handleInputChange}
                                margin="normal"
                                multiline
                                rows={4}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        '&:hover fieldset': {
                                            borderColor: TASK_ACTIONS_FEEDBACK_COLOR,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: TASK_ACTIONS_FEEDBACK_COLOR,
                                        },
                                        transition: 'all 0.3s ease',
                                        fontSize: { xs: '0.875rem', md: '1rem' }
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: { xs: '0.875rem', md: '1rem' }
                                    }
                                }}
                            />

                            <Fade in={true}>
                                <Box sx={{ mt: { xs: 3, md: 4 } }}>
                                    {handleLoading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                                            <CircularProgress size={28} sx={{ color: TASK_ACTIONS_FEEDBACK_COLOR }} />
                                            <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>
                                                Creating your handle...
                                            </Typography>
                                        </Box>
                                    ) : handleExists ? (
                                        <Paper 
                                            elevation={0}
                                            sx={{
                                                p: { xs: 2, md: 3 },
                                                bgcolor: 'rgba(0, 102, 255, 0.08)',
                                                borderRadius: '16px',
                                                border: '1px solid rgba(0, 102, 255, 0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 8px rgba(0, 102, 255, 0.1)'
                                                }
                                            }}
                                        >
                                            <PersonIcon sx={{ 
                                                color: TASK_ACTIONS_FEEDBACK_COLOR,
                                                fontSize: { xs: '1.5rem', md: '2rem' }
                                            }} />
                                            <Typography variant="body1" sx={{ 
                                                color: 'text.primary',
                                                fontSize: { xs: '0.875rem', md: '1rem' }
                                            }}>
                                                Your handle: <strong>{userHandle}</strong>
                                            </Typography>
                                        </Paper>
                                    ) : (
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ 
                                                mb: 2, 
                                                color: 'text.secondary',
                                                fontSize: { xs: '0.875rem', md: '1rem' }
                                            }}>
                                                Choose your handle
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                value={handleInput}
                                                onChange={handleHandleInputChange}
                                                placeholder="Enter your handle"
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PersonIcon sx={{ color: 'text.secondary' }} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            {handleInput && (
                                                                isHandleValid ? 
                                                                    <CheckCircleIcon sx={{ color: 'success.main' }} /> :
                                                                    <ErrorIcon sx={{ color: 'error.main' }} />
                                                            )}
                                                        </InputAdornment>
                                                    )
                                                }}
                                                sx={{
                                                    mb: 2,
                                                    '& .MuiOutlinedInput-root': {
                                                        '&:hover fieldset': {
                                                            borderColor: TASK_ACTIONS_FEEDBACK_COLOR,
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: TASK_ACTIONS_FEEDBACK_COLOR,
                                                        },
                                                        transition: 'all 0.3s ease',
                                                        fontSize: { xs: '0.875rem', md: '1rem' }
                                                    }
                                                }}
                                            />
                                            <Typography variant="caption" sx={{ 
                                                color: 'text.secondary', 
                                                mb: 2, 
                                                display: 'block',
                                                fontSize: { xs: '0.75rem', md: '0.8rem' }
                                            }}>
                                                Handle must be 3-20 characters long and contain only letters, numbers, and underscores
                                            </Typography>
                                            
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="caption" sx={{ 
                                                    color: 'text.secondary', 
                                                    display: 'block', 
                                                    mb: 1,
                                                    fontSize: { xs: '0.75rem', md: '0.8rem' }
                                                }}>
                                                    Suggested handles:
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    {handleSuggestions.map((suggestion, index) => (
                                                        <Tooltip key={index} title="Click to use this handle">
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() => {
                                                                    setHandleInput(suggestion);
                                                                    setIsHandleValid(true);
                                                                }}
                                                                sx={{
                                                                    borderRadius: '16px',
                                                                    textTransform: 'none',
                                                                    borderColor: 'rgba(0, 102, 255, 0.3)',
                                                                    transition: 'all 0.3s ease',
                                                                    fontSize: { xs: '0.75rem', md: '0.8rem' },
                                                                    '&:hover': {
                                                                        borderColor: TASK_ACTIONS_FEEDBACK_COLOR,
                                                                        backgroundColor: 'rgba(0, 102, 255, 0.08)',
                                                                        transform: 'translateY(-2px)',
                                                                        boxShadow: '0 2px 4px rgba(0, 102, 255, 0.1)'
                                                                    }
                                                                }}
                                                            >
                                                                {suggestion}
                                                            </Button>
                                                        </Tooltip>
                                                    ))}
                                                </Box>
                                            </Box>

                                            <Button
                                                variant="contained"
                                                onClick={generateUserHandle}
                                                disabled={!isHandleValid || handleLoading}
                                                startIcon={<AutoAwesomeIcon />}
                                                sx={{
                                                    backgroundColor: TASK_ACTIONS_FEEDBACK_COLOR,
                                                    color: 'white',
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    boxShadow: '0 2px 8px rgba(0, 102, 255, 0.25)',
                                                    transition: 'all 0.3s ease',
                                                    fontSize: { xs: '0.875rem', md: '1rem' },
                                                    padding: { xs: '8px 16px', md: '10px 20px' },
                                                    '&:hover': {
                                                        backgroundColor: '#0052cc',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)',
                                                    },
                                                    '&:active': {
                                                        transform: 'translateY(0)',
                                                    }
                                                }}
                                            >
                                                Create Handle
                                            </Button>
                                        </Box>
                                    )}
                                    {handleError && (
                                        <Alert 
                                            severity="error" 
                                            sx={{ 
                                                mt: 2,
                                                borderRadius: '12px',
                                                transition: 'all 0.3s ease',
                                                '& .MuiAlert-icon': {
                                                    color: 'error.main'
                                                }
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {handleError}
                                            </Typography>
                                            {handleErrorDetails && (
                                                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'error.dark' }}>
                                                    {handleErrorDetails}
                                                </Typography>
                                            )}
                                        </Alert>
                                    )}
                                </Box>
                            </Fade>
                        </DialogContent>
                        <DialogActions sx={{ 
                            padding: { xs: '20px 24px', md: '24px 32px' },
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                            borderTop: '1px solid rgba(0, 102, 255, 0.1)'
                        }}>
                            <Button
                                variant="text"
                                onClick={handleDialogClose}
                                disabled={loading}
                                sx={{
                                    color: '#555',
                                    padding: { xs: '8px 16px', md: '10px 20px' },
                                    transition: 'all 0.3s ease',
                                    fontSize: { xs: '0.875rem', md: '1rem' },
                                    '&:hover': {
                                        backgroundColor: 'rgba(0,0,0,0.04)',
                                        transform: 'translateY(-1px)'
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading || !postData.selectedQuery || !handleExists}
                                sx={{
                                    backgroundColor: TASK_ACTIONS_FEEDBACK_COLOR,
                                    color: 'white',
                                    padding: { xs: '10px 24px', md: '12px 28px' },
                                    borderRadius: '12px',
                                    boxShadow: '0 3px 8px rgba(0, 102, 255, 0.25)',
                                    transition: 'all 0.3s ease',
                                    fontSize: { xs: '0.875rem', md: '1rem' },
                                    '&:hover': {
                                        backgroundColor: '#0052cc',
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 6px 12px rgba(0, 102, 255, 0.3)'
                                    },
                                    '&:active': {
                                        transform: 'translateY(1px)',
                                        boxShadow: '0 2px 4px rgba(0, 102, 255, 0.2)'
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Post & Get 4 Credits'}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default DiscoverPostButton; 