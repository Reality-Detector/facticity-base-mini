import React from 'react'

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
        <p style={{ color: '#0066FF', fontSize : '100px', paddingBottom : 0, marginBottom: 0}}>Let's get</p>
        <p style={{ color: '#0066FF', fontSize : '100px', paddingTop : 0, marginTop: 0}}>fact-checking!</p>
        </div>

        <input type="text" placeholder="Enter text here" style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} />
    </div>
);
}

export default Welcome