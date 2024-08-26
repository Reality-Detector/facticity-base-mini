import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton, MenuItem, Popover } from "@mui/material";
import { Search, Add, VideoCall, Image, Description, Close, Link } from "@mui/icons-material";
import SquareCards from './Examples';

const Welcome = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const columnStyle = {
        flex: 1,
        padding: '10px',
        boxSizing: 'border-box',
        position: 'relative',
    };

    return (
        <div style={{
            ...columnStyle,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
        }}>
            <h1 style={{ color: '#0066FF' }}>FACTICITY</h1>
            <div>
                <p style={{ color: '#0066FF', fontSize: '70px', paddingBottom: 0, marginBottom: 0 }}>Let's get</p>
                <p style={{ color: '#0066FF', fontSize: '70px', paddingTop: 0, marginTop: 0 }}>fact-checking!</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", marginBottom: '20px' }}>
                {/* Upload Button */}
                <IconButton
                    style={{
                        backgroundColor: '#FFFFFF',
                        color: '#696969',
                        borderRadius: '50%',
                        padding: '12px',
                        marginRight: '10px',
                        border: '0.5px solid #696969',
                    }}
                    onClick={handleClick}
                >
                    <Add />
                </IconButton>

                {/* Search Input */}
                <TextField
                    variant="outlined"
                    placeholder="Type..."
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
                                    <Search style={{ color: '#0066FF' }} />
                                </IconButton>
                            </InputAdornment>
                        ),
                        style: { borderRadius: 50, backgroundColor: '#FFFFFF', width: '100vh' },
                    }}
                />
            </div>

            {/* Cards rendered below the search input */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', width: '100%' }}>
                <SquareCards />
            </div>

            {/* Popover menu */}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <MenuItem>
                        <IconButton>
                            <VideoCall />
                        </IconButton>
                        <p>Video</p>
                    </MenuItem>
                    <MenuItem>
                        <IconButton>
                            <Link />
                        </IconButton>
                        <p>Video Link</p>
                    </MenuItem>
                    <MenuItem>
                        <IconButton>
                            <Image />
                        </IconButton>
                        <p>Image</p>
                    </MenuItem>
                    <MenuItem>
                        <IconButton>
                            <Description />
                        </IconButton>
                        <p>Document</p>
                    </MenuItem>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </div>
            </Popover>
        </div>
    );
}

export default Welcome;
