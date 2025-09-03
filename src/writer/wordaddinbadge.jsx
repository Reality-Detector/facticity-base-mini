// import React from 'react';

// const WordAddInBadge = () => {
//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <img
//           src="/word.png"
//           alt="Word Icon"
//           style={styles.icon}
//         />
//         <span style={styles.title}>Word Add-in</span>
//         <span style={styles.tag}>Coming Soon</span>
//       </div>
//       <p style={styles.subtitle}>Research smarter, not harder</p>
//       <button style={styles.button}>Join waitlist</button>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     position: 'fixed',
//     bottom: '20px',
//     left: '20px',
//     backgroundColor: '#F7F8FA',
//     border: '1px solid #D1D5DB',
//     borderRadius: '12px',
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//     width: '250px',
//     padding: '16px',
//     fontFamily: 'Arial, sans-serif',
//     color: '#1F2937',
//   },
//   header: {
//     display: 'flex',
//     alignItems: 'center',
//     marginBottom: '8px',
//   },
//   icon: {
//     width: '24px',
//     height: '24px',
//     marginRight: '8px',
//   },
//   title: {
//     fontSize: '16px',
//     fontWeight: '600',
//     marginRight: '8px',
//   },
//   tag: {
//     fontSize: '12px',
//     fontWeight: '500',
//     color: '#9CA3AF',
//     backgroundColor: '#E5E7EB',
//     borderRadius: '4px',
//     padding: '2px 6px',
//   },
//   subtitle: {
//     fontSize: '14px',
//     color: '#6B7280',
//     marginBottom: '12px',
//   },
//   button: {
//     backgroundColor: '#000',
//     color: '#FFF',
//     border: 'none',
//     borderRadius: '6px',
//     padding: '8px 12px',
//     cursor: 'pointer',
//     fontWeight: '600',
//     fontSize: '14px',
//     width: '100%',
//   },
// };

// export default WordAddInBadge;



// import React, { useState } from 'react';

// const WordAddInBadge = () => {
//   const [isVisible, setIsVisible] = useState(true);

//   const handleClose = () => {
//     setIsVisible(false);
//   };

//   if (!isVisible) return null;

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <img
//           src="/word.png"
//           alt="Word Icon"
//           style={styles.icon}
//         />
//         <span style={styles.title}>Word Add-in</span>
//         <span style={styles.tag}>Coming Soon</span>
//         <button style={styles.closeButton} onClick={handleClose}>
//           ✕
//         </button>
//       </div>
//       {/* <p style={styles.subtitle}></p> */}
//       <p style={styles.subtitle}>Integrate this into your MS Word <br></br>Research smarter, not harder</p>
//       <button
//         style={styles.button}
//         onClick={() => window.open('https://tally.so/r/mV1V0v', '_blank')}
//       >
//         Join waitlist
//       </button>
//     </div>
//   );  
// };

// const styles = {
//   container: {
//     position: 'fixed',
//     bottom: '20px',
//     left: '20px',
//     backgroundColor: '#F7F8FA',
//     border: '1px solid #D1D5DB',
//     borderRadius: '12px',
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//     width: '250px',
//     padding: '16px',
//     fontFamily: 'Arial, sans-serif',
//     color: '#1F2937',
//   },
//   header: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: '8px',
//   },
//   icon: {
//     width: '24px',
//     height: '24px',
//     marginRight: '8px',
//   },
//   title: {
//     fontSize: '16px',
//     fontWeight: '600',
//     marginRight: '8px',
//   },
//   tag: {
//     fontSize: '12px',
//     fontWeight: '500',
//     color: '#9CA3AF',
//     backgroundColor: '#E5E7EB',
//     borderRadius: '4px',
//     padding: '2px 6px',
//   },
//   closeButton: {
//     background: 'none',
//     border: 'none',
//     fontSize: '16px',
//     color: '#9CA3AF',
//     cursor: 'pointer',
//     marginLeft: 'auto',
//   },
//   subtitle: {
//     fontSize: '14px',
//     color: '#6B7280',
//     marginBottom: '12px',
//   },
//   button: {
//     backgroundColor: '#000',
//     color: '#FFF',
//     border: 'none',
//     borderRadius: '6px',
//     padding: '8px 12px',
//     cursor: 'pointer',
//     fontWeight: '600',
//     fontSize: '14px',
//     width: '100%',
//   },
// };

// export default WordAddInBadge;


import React, { useState } from 'react';

const WordAddInBadge = ({ position = 'bottom-left', minimal = false }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  // Dynamic styles for positioning
  const dynamicPositionStyles =
    position === 'bottom-right'
      ? { right: '20px', left: 'auto' }
      : { left: '20px', right: 'auto' };

  return (
    // <div style={{ ...styles.container, ...dynamicPositionStyles }}>
    //   <div style={styles.header}>
    //     <img src="/word.png" alt="Word Icon" style={styles.icon} />
    //     <span style={styles.title}>Word Add-in</span>
    //     <span style={styles.tag}>Coming Soon</span>
    //     <button style={styles.closeButton} onClick={handleClose}>
    //       ✕
    //     </button>
    //   </div>
    //   <p style={styles.subtitle}>
    //     Integrate Facticity.AI into your MS Word <br />
    //     Research smarter, not harder
    //   </p>
    //   <button
    //     style={styles.button}
    //     onClick={() => window.open('https://tally.so/r/mV1V0v', '_blank')}
    //   >
    //     Join waitlist
    //   </button>
    // </div>
    <div style={{ ...styles.container, ...dynamicPositionStyles }}>
      {!minimal && ( // Use '&&' for conditional rendering
        <>
          <div style={styles.header}>
            <img src="/word.png" alt="Word Icon" style={styles.icon} />
            <span style={styles.title}>Word Add-in</span>
            <span style={styles.tag}>Coming Soon</span>
            <button style={styles.closeButton} onClick={handleClose}>
              ✕
            </button>
          </div>
          <p style={styles.subtitle}>
            Integrate Facticity.AI into your MS Word <br />
            Research smarter, not harder
          </p>
        </>
      )}

      <button
        style={styles.button}
        onClick={() => window.open('https://tally.so/r/mV1V0v', '_blank')}
      >
        Join waitlist
      </button>
    </div>

  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    backgroundColor: '#F7F8FA',
    border: '1px solid #D1D5DB',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '250px',
    padding: '16px',
    fontFamily: 'Arial, sans-serif',
    color: '#1F2937',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  icon: {
    width: '24px',
    height: '24px',
    marginRight: '8px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    marginRight: '8px',
  },
  tag: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#9CA3AF',
    backgroundColor: '#E5E7EB',
    borderRadius: '4px',
    padding: '2px 6px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#9CA3AF',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '12px',
  },
  button: {
    backgroundColor: '#000',
    color: '#FFF',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    width: '100%',
  },
};

export default WordAddInBadge;
