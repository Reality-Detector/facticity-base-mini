import React from 'react'
import { Button, IconButton } from '@mui/material';


const ThirdColumn = () => {
    const columnStyle = {
        flex: 1,
        padding: '10px',
        boxSizing: 'border-box',
        position: 'relative',
    };
    
return (
    <div style={{ ...columnStyle }}>
                    <div style={{ float: 'right' }}>
                        <Button variant="contained" color="primary">
                            Sign In
                        </Button>
                    </div>
                </div>
);
}

export default ThirdColumn