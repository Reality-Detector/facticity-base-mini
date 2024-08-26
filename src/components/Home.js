import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Welcome from './Welcome';
import ThirdColumn from './ThirdColumn';

const Home = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const columnStyle = {
        flex: 1,
        padding: '10px',
        boxSizing: 'border-box',
        position: 'relative',
    };

    return (
        <div id="home_parent" style={{ backgroundColor: '#F1F3FE', width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
                id="inner_blue_border_div"
                style={{
                    width: '98%',
                    height: '98%',
                    border: '1.5px solid #0066FF',
                    borderRadius: '20px',
                    display: 'flex',
                    position: 'relative',
                    overflow: 'hidden',
                    justifyContent: 'space-between',
                }}
            >
                {/* First Column - Sidebar */}
                <div style={{ ...columnStyle, position: 'relative' }}>
                    <IconButton onClick={toggleSidebar} style={{ position: 'absolute', top: 15, left: 0, zIndex: 1000 }}>
                        <MenuIcon style = {{color : '#0066FF'}}/>
                    </IconButton>
                    <Sidebar isOpen={isSidebarOpen} style={{ marginTop: '20px' }} />
                </div>

                {/* Middle Column - Header and Textbox */}
               <Welcome></Welcome>

                {/* Last Column - Sign In Button */}
                <ThirdColumn></ThirdColumn>
            </div>
        </div>
    );
};

export default Home;