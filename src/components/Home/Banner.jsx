import React, { useEffect } from 'react';
import '@/styles/Banner.css'; // Import the CSS for styling
import CloseIcon from '@mui/icons-material/Close';

const Banner = ({ isVisible, setIsVisible }) => {
  // useEffect(() => {
  //   const isMobile = window.innerWidth < 768; // Check if the screen width is mobile

  //   if (isVisible && isMobile) {
  //     // Automatically close the banner after 6 seconds on mobile screens
  //     const timer = setTimeout(() => {
  //       setIsVisible(false);
  //     }, 6000); // 6 seconds

  //     return () => clearTimeout(timer); // Cleanup on unmount
  //   }
  // }, [isVisible, setIsVisible]);

  return (
    <div className="banner">
      <div className="banner-content">
        <a
          href="https://time.com/7094922/ai-seer-facticity-ai/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/timesBest.png"
            alt="Times Best Invention"
            className="banner-image"
          />
        </a>
        <div className="banner-text">
          <a
            href="https://time.com/7094922/ai-seer-facticity-ai/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p>
              Recognized by TIME's Best Inventions of 2024 as one of 14 AIs
            </p>
          </a>
        </div>
        <button
          className="banner-close-button"
          onClick={() => setIsVisible(false)}
          style={{ backgroundColor: "transparent", border: "none", cursor: "pointer" }}
        >
          <CloseIcon sx={{ fontSize: 25 }} /> {/* Adjust font size as needed */}
        </button>
      </div>
    </div>
  );
};

export default Banner;
