import React from 'react'
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import { Search, Add } from "@mui/icons-material";

const Welcome = () => {
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
            alignItems: 'center', // Horizontally centers the content
            textAlign: 'center'  // Optional for text centering inside elements
        }}>
            <h1 style={{ color: '#0066FF' }}>FACTICITY</h1>
            <div>
                <p style={{ color: '#0066FF', fontSize: '70px', paddingBottom: 0, marginBottom: 0 }}>Let's get</p>
                <p style={{ color: '#0066FF', fontSize: '70px', paddingTop: 0, marginTop: 0 }}>fact-checking!</p>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
                {/* Upload Button */}
                <IconButton
                    style={{
                        backgroundColor: 'FFFFFF', // Light gray background color for the button
                        color: '#696969',            // Dark gray color for the plus icon
                        borderRadius: '50%',         // Makes the button round
                        padding: '12px',             // Adjust padding to make the button rounder
                        marginRight: '10px',
                        border: '0.5px solid #696969'
                    }}
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
                                    <Search style = {{color : '#0066FF'}} />
                                </IconButton>
                            </InputAdornment>
                        ),
                        style: { borderRadius: 50, backgroundColor: '#FFFFFF', width: '100vh' },
                    }}
                />
            </div>    </div>
    );
}

export default Welcome