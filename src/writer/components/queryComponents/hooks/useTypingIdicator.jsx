// // src/hooks/useTypingIndicator.js

// import { useState, useEffect } from 'react';

// const useTypingIndicator = (isTyping) => {
//   const [display, setDisplay] = useState(false);

//   useEffect(() => {
//     let timeout;
//     if (isTyping) {
//       setDisplay(true);
//       // Optional: Hide after a timeout
//       timeout = setTimeout(() => setDisplay(false), 5000);
//     } else {
//       setDisplay(false);
//     }
//     return () => clearTimeout(timeout);
//   }, [isTyping]);

//   return display;
// };

// export default useTypingIndicator;


import { useState, useEffect } from 'react';

const useTypingIndicator = (isTyping) => {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    // Directly set the display state based on isTyping
    setDisplay(isTyping);
  }, [isTyping]);

  return display;
};

export default useTypingIndicator;
