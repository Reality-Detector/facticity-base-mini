// Modal.js
import React from 'react';
import Modal from 'react-modal';
import { Button } from '@mui/material';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '80%',
        maxHeight: '80%',
        overflow: 'auto',
        backgroundColor : 'gray',
        color : 'white'
    }
};

Modal.setAppElement('#root'); // Set the root element for accessibility

const AboutModal = ({ isOpen, closeModal }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="About Modal"
        >
            <h2>About</h2>
            <p>Facticity is <a href="https://www.aiseer.co" target="_blank" rel="noopener noreferrer" style = {{color: 'white'}}> Seer's </a>  latest product - GenAI powered real-time Fact-Checker. This current website is exclusively made for the Presidential Debate. <br/> To try out Facticity's fact-checking magic, head over to <a href="https://www.facticity.ai" target="_blank" rel="noopener noreferrer" style = {{color: 'white'}}>www.facticity.ai </a>. Thanks for visiting!</p>
            <Button onClick={closeModal} style = {{color: 'white'}} >Back</Button>
        </Modal>
    );
};

export default AboutModal;
