import React, { useState, useEffect } from 'react';

const Toast = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide toast after 6 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      onClose(); // Notify when toast is closed
    }, 4000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [onClose]);

  const toastStyle = {
    position: 'fixed',
    top: '20px', // Position at the top of the screen
    left: '50%', // Center horizontally
    transform: 'translateX(-50%)', // Offset by half of the toast's width to center it
    padding: '10px 20px',
    backgroundColor: 'green', // Change to green
    color: 'white',
    borderRadius: '5px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    opacity: 0.9,
    zIndex: 1000,
    animation: 'slideIn 0.3s ease-out',
  };

  const keyframesStyle = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  return visible ? (
    <>
      <style>{keyframesStyle}</style> {/* Adding keyframes dynamically */}
      <div style={toastStyle}>
        <span>{message}</span>
      </div>
    </>
  ) : null;
};

export default Toast;
