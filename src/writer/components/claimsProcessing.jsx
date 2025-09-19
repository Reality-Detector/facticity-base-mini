// import React, { useEffect, useContext } from 'react';
// import {
//   Box,
//   Button,
//   Typography,
//   Snackbar,
//   Alert,
//   IconButton,
//   Tooltip,
//   CircularProgress,
// } from '@mui/material';
// import { keyframes } from '@mui/system'; // or '@emotion/react'
// import CheckIcon from '@mui/icons-material/Check';
// import StopIcon from '@mui/icons-material/Stop';
// import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { AppContext } from './AppContext';

// // Define keyframes for the "reflection" or "flowing highlight" animation
// const reflectionAnimation = keyframes`
//   0% {
//     background-position: -200% 0;
//   }
//   100% {
//     background-position: 200% 0;
//   }
// `;

// const ClaimsProcessingModule = ({
//   claims,
//   facts,
//   setClaimsProcessing,
//   totalProcessed,
//   rewriteDocumentText,
//   handleCheck,
//   claimsRemaining,
//   setClaimsRemaining,
//   wordCount,
// }) => {
//   const {
//     checkEnabled,
//     setCheckEnabled,
//     isAuthenticated,
//     isFactChecking,
//     setIsFactChecking,
//   } = useContext(AppContext);

//   const [openSnackbar, setOpenSnackbar] = React.useState(false);
//   // NEW: Controls display of the “no words selected” alert
//   const [openWordCountAlert, setOpenWordCountAlert] = React.useState(false);

//   // Calculate how many claims remain
//   setClaimsRemaining(Math.max(claims.length - totalProcessed, 0));

//   // Calculate progress percentage (0–100)
//   const progressPercentage =
//     claims.length > 0
//       ? Math.min((totalProcessed / claims.length) * 100, 100)
//       : 0;

//   /**
//    * Starts or stops the fact-check process.
//    */
//   const handleToggleFactCheck = () => {
//     if (!isFactChecking) {
//       // If no words selected, show alert and don't proceed
//       if (wordCount === 0) {
//         setOpenWordCountAlert(true);
//         return;
//       }
//       // Otherwise, start fact-checking
//       setIsFactChecking(true);
//       handleCheck();
//     } else {
//       // Stop fact-checking
//       setIsFactChecking(false);
//       setClaimsProcessing([]);
//       setClaimsRemaining(0);
//       setCheckEnabled(true);
//     }
//   };

//   /**
//    * Handle rewrite action
//    */
//   const initiateRewrite = () => {
//     rewriteDocumentText();
//   };

//   /**
//    * Detect completion
//    */
//   useEffect(() => {
//     if (isFactChecking && progressPercentage === 100 && claims.length > 0) {
//       setIsFactChecking(false);
//       setOpenSnackbar(true);
//       setClaimsProcessing([]);
//       setCheckEnabled(true);
//     }
//   }, [
//     isFactChecking,
//     progressPercentage,
//     claims.length,
//     setClaimsProcessing,
//     setCheckEnabled,
//   ]);

//   /**
//    * Handle Snackbar closure
//    */
//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === 'clickaway') return;
//     setOpenSnackbar(false);
//   };

//   /**
//    * Returns the button text, depending on current state
//    */
//   const getButtonText = () => {
//     if (!isFactChecking) {
//       return 'Check Facts';
//     }
//     if (isFactChecking && claims.length === 0) {
//       return 'Extracting Claims';
//     }
//     return `${claims.length - claimsRemaining}/${claims.length} claims checked`;
//   };

//   /**
//    * Returns the startIcon, depending on current state
//    */
//   const getStartIcon = () => {
//     if (!isFactChecking) {
//       return <CheckIcon />;
//     }

//     // If fact-checking and there are no claims yet, show a spinner
//     if (claims.length === 0) {
//       return (
//         <CircularProgress
//           size={24}
//           sx={{
//             color: '#3f51b5',
//           }}
//         />
//       );
//     }

//     // Otherwise, show the progress circle with a stop icon
//     return (
//       <Box position="relative" display="inline-flex">
//         <CircularProgress
//           variant="determinate"
//           value={progressPercentage}
//           size={24}
//           sx={{
//             color: progressPercentage === 100 ? '#4caf50' : '#3f51b5',
//           }}
//         />
//         <Box
//           sx={{
//             top: 0,
//             left: 0,
//             bottom: 0,
//             right: 0,
//             position: 'absolute',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}
//         >
//           <StopIcon sx={{ color: '#0066FF' }} />
//         </Box>
//       </Box>
//     );
//   };

//   /**
//    * Conditionally apply “reflection” animation if in fact-checking mode
//    */
//   const buttonAnimationStyles = isFactChecking
//     ? {
//         background: 'linear-gradient(270deg, #E5F1FA, #0096FF, #E5F1FA)',
//         backgroundSize: '400% 400%',
//         animation: `${reflectionAnimation} 10s ease infinite`,
//       }
//     : {};

//   return (
//     <Box>
//       {/* ---- CLAIMS DISPLAY (Above Buttons) ---- */}
//       {claims.length > 0 && (
//         <Box
//             sx={{
//               maxHeight: '160px',
//               overflowY: 'auto',
//               display: 'flex',
//               flexDirection: 'column',
//               gap: 1, // minimal space between claims
//               p: 1,
//               mb: 2,
//               backgroundColor: '#F1F3FE', // updated background color
//               borderRadius: '8px',
//               border: '1px solid #e0e0e0', // light border for subtle outline
//             }}
//           >
//             <Typography
//               variant="body2"
//               sx={{ fontWeight: 600, color: '#555', mb: 1 }}
//             >
//               Verifying the following setences. Please wait...
//             </Typography>
//             {claims.map((claim, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   backgroundColor: '#FFFFFF', // inner cards remain white for contrast
//                   borderRadius: '6px',
//                   padding: '8px 12px',
//                   border: '1px solid #e0e0e0', // subtle border for separation
//                 }}
//               >
//                 <Typography
//                   variant="body2"
//                   sx={{ fontWeight: 500, color: '#333' }}
//                 >
//                   {claim}
//                 </Typography>
//               </Box>
//             ))}
//           </Box>
   
//       )}

//       {/* ---- BUTTON ROW ---- */}
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           mb: 2,
//         }}
//       >
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: 2,
//             backgroundColor: '#FFFFFF',
//             padding: 2,
//             borderRadius: '8px',
//           }}
//         >
//           {/* Single Button for both states */}
//           {isAuthenticated ? (
//             <Button
//               variant="contained"
//               onClick={handleToggleFactCheck}
//               disabled={!checkEnabled && !isFactChecking}
//               startIcon={getStartIcon()}
//               sx={{
//                 fontWeight: 'bold',
//                 padding: '12px 24px',
//                 fontSize: '1rem',
//                 borderRadius: '15px',
//                 backgroundColor: '#E5F1FA',
//                 color: '#0066FF',
//                 boxShadow: 'none',
//                 transition: 'background-color 0.3s ease',

//                 '&:hover': {
//                   backgroundColor: '#E5F1FA',
//                   boxShadow: 'none',
//                 },
//                 // Merge in reflection style only if isFactChecking
//                 ...buttonAnimationStyles,
//               }}
//             >
//               {getButtonText()}
//             </Button>
//           ) : (
//             <div>Please log in to continue.</div>
//           )}

//           {/* Rewrite Button */}
//           <Tooltip title="Rewrite Document">
//             <IconButton
//               color="primary"
//               onClick={initiateRewrite}
//               disabled={!checkEnabled || isFactChecking}
//               sx={{
//                 backgroundColor: 'transparent',
//                 boxShadow: 'none',
//                 '&:hover': {
//                   backgroundColor: 'transparent',
//                 },
//               }}
//             >
//               <AutoAwesomeIcon sx={{ color: 'black' }} />
//             </IconButton>
//           </Tooltip>

//           {/* Vertical Divider */}
//           <Box
//             sx={{
//               width: '1px',
//               height: '40px',
//               backgroundColor: 'rgba(0, 0, 0, 0.12)',
//             }}
//           />

//           {/* Options Button (currently disabled) */}
//           <Tooltip title="Options">
//             <IconButton
//               color="primary"
//               disabled
//               sx={{
//                 backgroundColor: 'transparent',
//                 boxShadow: 'none',
//                 border: 'none',
//               }}
//             >
//               <MoreVertIcon sx={{ color: 'grey' }} />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </Box>

//       {/* ---- SNACKBAR: COMPLETION ---- */}
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity="success"
//           sx={{ width: '100%' }}
//         >
//           Claims processing complete!
//         </Alert>
//       </Snackbar>

//       {/* ---- SNACKBAR: NO WORDS SELECTED ---- */}
//       <Snackbar
//         open={openWordCountAlert}
//         autoHideDuration={6000}
//         onClose={() => setOpenWordCountAlert(false)}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert
//           onClose={() => setOpenWordCountAlert(false)}
//           severity="warning"
//           sx={{ width: '100%' }}
//         >
//           No words selected. Please highlight text to fact check.
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ClaimsProcessingModule;


import React, { useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
  Menu,         // NEW CODE
  MenuItem,     // NEW CODE
  Checkbox,     // NEW CODE
} from '@mui/material';
import { keyframes } from '@mui/system'; // or '@emotion/react'
import CheckIcon from '@mui/icons-material/Check';
import StopIcon from '@mui/icons-material/Stop';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AppContext } from './AppContext';
import useAuth from '../../auth/useAuthHook';


// Define keyframes for the "reflection" or "flowing highlight" animation
const reflectionAnimation = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const ClaimsProcessingModule = ({
  claims,
  facts,
  setClaimsProcessing,
  totalProcessed,
  rewriteDocumentText,
  handleCheck,
  claimsRemaining,
  setClaimsRemaining,
  wordCount,
}) => {
  const {
    checkEnabled,
    setCheckEnabled,
    isAuthenticated,
    isFactChecking,
    setIsFactChecking,
    filter, setFilter
  } = useContext(AppContext);

  const { loginWithPopup} = useAuth();

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  // NEW: Controls display of the “no words selected” alert
  const [openWordCountAlert, setOpenWordCountAlert] = React.useState(false);

  const wordlimit = 500;
  // NEW CODE: state to control the filter: { search: [] }
  

  // NEW CODE: anchorEl for the options menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const optionsMenuOpen = Boolean(anchorEl);

  // Calculate how many claims remain
  React.useEffect(() => {
    setClaimsRemaining(Math.max(claims.length - totalProcessed, 0));
  }, [claims.length, totalProcessed]);

  // Calculate progress percentage (0–100)
  const progressPercentage =
    claims.length > 0
      ? Math.min((totalProcessed / claims.length) * 100, 100)
      : 0;

  /**
   * Starts or stops the fact-check process.
   */
  const handleToggleFactCheck = () => {
    if (!isFactChecking) {
      // If no words selected, show alert and don't proceed
      if (wordCount === 0 | wordCount>=wordlimit) {
        setOpenWordCountAlert(true);
        return;
      }
      // Otherwise, start fact-checking
      setIsFactChecking(true);
      handleCheck();
    } else {
      // Stop fact-checking
      setIsFactChecking(false);
      setClaimsProcessing([]);
      setClaimsRemaining(0);
      setCheckEnabled(true);
    }
  };

  /**
   * Handle rewrite action
   */
  const initiateRewrite = () => {
    rewriteDocumentText();
  };

  /**
   * Detect completion
   */
  useEffect(() => {
    if (isFactChecking && progressPercentage === 100 && claims.length > 0) {
      setIsFactChecking(false);
      setOpenSnackbar(true);
      setClaimsProcessing([]);
      setCheckEnabled(true);
    }
  }, [
    isFactChecking,
    progressPercentage,
    claims.length,
    setClaimsProcessing,
    setCheckEnabled,
  ]);

  /**
   * Handle Snackbar closure
   */
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  /**
   * Returns the button text, depending on current state
   */
  const getButtonText = () => {
    if (!isFactChecking) {
      return 'Check Facts';
    }
    if (isFactChecking && claims.length === 0) {
      return 'Extracting Claims';
    }
    return `${claims.length - claimsRemaining}/${claims.length} claims checked`;
  };

  /**
   * Returns the startIcon, depending on current state
   */
  const getStartIcon = () => {
    if (!isFactChecking) {
      return <CheckIcon />;
    }

    // If fact-checking and there are no claims yet, show a spinner
    if (claims.length === 0) {
      return (
        <CircularProgress
          size={24}
          sx={{
            color: '#3f51b5',
          }}
        />
      );
    }

    // Otherwise, show the progress circle with a stop icon
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          value={progressPercentage}
          size={24}
          sx={{
            color: progressPercentage === 100 ? '#4caf50' : '#3f51b5',
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <StopIcon sx={{ color: '#0066FF' }} />
        </Box>
      </Box>
    );
  };

  /**
   * Conditionally apply “reflection” animation if in fact-checking mode
   */
  const buttonAnimationStyles = isFactChecking
    ? {
        background: 'linear-gradient(270deg, #E5F1FA, #0096FF, #E5F1FA)',
        backgroundSize: '400% 400%',
        animation: `${reflectionAnimation} 10s ease infinite`,
      }
    : {};

  /**
   * Menu handling for Options button
   */
  const handleOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOptionsClose = () => {
    setAnchorEl(null);
  };

  /**
   * Toggles either "web" or "journals" in filter.search
   */
  const handleToggleSearch = (option) => {
    setFilter((prev) => {
      const newSearch = [...prev.search];
      if (newSearch.includes(option)) {
        // If already in array, remove it
        return {
          ...prev,
          search: newSearch.filter((item) => item !== option),
        };
      } else {
        // Otherwise, add it
        newSearch.push(option);
        return {
          ...prev,
          search: newSearch,
        };
      }
    });
  };

  return (
    <Box>
      {/* ---- CLAIMS DISPLAY (Above Buttons) ---- */}
      {claims.length > 0 && (
        <Box
          sx={{
            maxHeight: '160px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1, // minimal space between claims
            p: 1,
            mb: 2,
            backgroundColor: '#F1F3FE', // updated background color
            borderRadius: '8px',
            border: '1px solid #e0e0e0', // light border for subtle outline
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: '#555', mb: 1 }}
          >
            Verifying the following sentences. Please wait...
          </Typography>
          {claims.map((claim, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: '#FFFFFF', // inner cards remain white for contrast
                borderRadius: '6px',
                padding: '8px 12px',
                border: '1px solid #e0e0e0', // subtle border for separation
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: '#333' }}
              >
                {claim}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* ---- BUTTON ROW ---- */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            backgroundColor: '#FFFFFF',
            padding: 2,
            borderRadius: '8px',
          }}
        >
          {/* Single Button for both states */}
          {isAuthenticated ? (
            <Button
              variant="contained"
              onClick={handleToggleFactCheck}
              disabled={!checkEnabled && !isFactChecking}
              startIcon={getStartIcon()}
              sx={{
                fontWeight: 'bold',
                padding: '12px 24px',
                fontSize: '1rem',
                borderRadius: '15px',
                backgroundColor: '#E5F1FA',
                color: '#0066FF',
                boxShadow: 'none',
                transition: 'background-color 0.3s ease',

                '&:hover': {
                  backgroundColor: '#E5F1FA',
                  boxShadow: 'none',
                },
                // Merge in reflection style only if isFactChecking
                ...buttonAnimationStyles,
              }}
            >
              {getButtonText()}
            </Button>
          ) : (
            <div>
            Please{" "}
            <a href="#" onClick={loginWithPopup}>
              sign in
            </a>{" "}
            to continue.
          </div>
          )}

          {/* Rewrite Button */}
          {/* <Tooltip title="Rewrite Document">
            <IconButton
              color="primary"
              onClick={initiateRewrite}
              disabled={!checkEnabled || isFactChecking}
              sx={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <AutoAwesomeIcon sx={{ color: 'black' }} />
            </IconButton>
          </Tooltip> */}

          {/* Vertical Divider */}
          <Box
            sx={{
              width: '1px',
              height: '40px',
              backgroundColor: 'rgba(0, 0, 0, 0.12)',
            }}
          />

          {/* Options Button (Enabled) */}
          <Tooltip title="Options">
            <IconButton
              color="primary"
              onClick={handleOptionsClick} // <--- OPEN MENU
              sx={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                border: 'none',
              }}
            >
              <MoreVertIcon sx={{ color: 'grey' }} />
            </IconButton>
          </Tooltip>
          {/* NEW CODE: The Menu for Options */}
          <Menu
            anchorEl={anchorEl}
            open={optionsMenuOpen}
            onClose={handleOptionsClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem>
              <Checkbox
                checked={filter.search.includes('web')}
                onChange={() => handleToggleSearch('web')}
              />
              Search Web
            </MenuItem>
            <MenuItem>
              <Checkbox
                checked={filter.search.includes('journals')}
                onChange={() => handleToggleSearch('journals')}
              />
              Search Journal Article
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* ---- SNACKBAR: COMPLETION ---- */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Claims processing complete!
        </Alert>
      </Snackbar>

      {/* ---- SNACKBAR: NO WORDS SELECTED ---- */}
      <Snackbar
        open={openWordCountAlert}
        autoHideDuration={6000}
        onClose={() => setOpenWordCountAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenWordCountAlert(false)}
          severity="warning"
          sx={{ width: '100%' }}
        >
          {wordCount === 0 
            ? "No words selected. Please highlight text to fact check." 
            : wordCount > wordlimit 
            ? "Please select less than "+wordlimit+" words at a time, please." 
            : ""}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClaimsProcessingModule;
