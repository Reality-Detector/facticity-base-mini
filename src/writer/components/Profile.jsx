// import React, { useState } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';

// const Profile = () => {
//   const { loginWithPopup, logout, user, isAuthenticated, isLoading } = useAuth0();
//   const [showDropdown, setShowDropdown] = useState(false);

//   if (isLoading) {
//     return <div style={styles.loading}>Loading...</div>;
//   }

//   return (
//     <div style={styles.container}>
//       {!isAuthenticated ? (
//         <button style={styles.loginButton} onClick={() => loginWithPopup()}>
//           Sign In
//         </button>
//       ) : (
//         <div style={styles.profileWrapper} onClick={() => setShowDropdown(!showDropdown)}>
//           <img src={user.picture} alt={user.name} style={styles.profileImage} />
//           {showDropdown && (
//             <div style={styles.dropdownMenu}>
//               <button
//                 style={styles.logoutButton}
//                 onClick={() => {
//                   setShowDropdown(false);
//                   logout();
//                 }}
//               >
//                 Log Out
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     position: 'absolute',
//     top: '10px',
//     right: '10px',
//     display: 'flex',
//     alignItems: 'center',
//   },
//   loginButton: {
//     backgroundColor: '#007bff',
//     color: '#fff',
//     padding: '8px 14px',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     fontSize: '0.9em',
//     transition: 'background-color 0.3s',
//   },
//   profileWrapper: {
//     display: 'flex',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: '6px 10px',
//     borderRadius: '8px',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//     cursor: 'pointer',
//     position: 'relative',
//   },
//   profileImage: {
//     width: '35px',
//     height: '35px',
//     borderRadius: '50%',
//     objectFit: 'cover',
//     marginRight: '10px',
//   },
//   userName: {
//     marginRight: '15px',
//     fontSize: '1em',
//     color: '#333',
//     fontWeight: '500',
//   },
//   dropdownMenu: {
//     position: 'absolute',
//     top: '50px',
//     right: '0',
//     backgroundColor: '#fff',
//     border: '1px solid #ddd',
//     borderRadius: '5px',
//     boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
//     padding: '10px',
//     zIndex: 1000,
//     textAlign: 'center',
//   },
//   logoutButton: {
//     backgroundColor: '#dc3545',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     padding: '6px 12px',
//     cursor: 'pointer',
//     fontSize: '0.9em',
//     transition: 'background-color 0.3s',
//     marginTop: '5px',
//   },
//   loading: {
//     fontSize: '1em',
//     color: '#333',
//     textAlign: 'center',
//     marginTop: '20px',
//   },
// };

// export default Profile;


// import React, { useState, useEffect, useRef } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';

// const Profile = () => {
//   const { loginWithPopup, logout, user, isAuthenticated, isLoading } = useAuth0();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   if (isLoading) {
//     return <div style={styles.loading}>Loading...</div>;
//   }

//   return (
//     <div style={styles.container}>
//       {!isAuthenticated ? (
//         <button style={styles.loginButton} onClick={() => loginWithPopup()}>
//           Sign In
//         </button>
//       ) : (
//         <div style={styles.profileWrapper} ref={dropdownRef}>
//           <img
//             src={user.picture}
//             alt={user.name}
//             style={styles.profileImage}
//             onClick={() => setShowDropdown(!showDropdown)}
//           />
//           {showDropdown && (
//             <div style={styles.dropdownMenu}>
//               <button
//                 style={styles.logoutButton}
//                 onClick={() => {
//                   setShowDropdown(false);
//                   logout({ returnTo: window.location.origin });
//                 }}
//               >
//                 Log Out
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     position: 'absolute',
//     top: '10px',
//     right: '10px',
//     display: 'flex',
//     alignItems: 'center',
//   },
//   loginButton: {
//     backgroundColor: '#007bff',
//     color: '#fff',
//     padding: '8px 14px',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     fontSize: '0.9em',
//     transition: 'background-color 0.3s',
//   },
//   profileWrapper: {
//     position: 'relative',
//     cursor: 'pointer',
//   },
//   profileImage: {
//     width: '35px',
//     height: '35px',
//     borderRadius: '50%',
//     objectFit: 'cover',
//     // Remove margin and background-related styles
//   },
//   dropdownMenu: {
//     position: 'absolute',
//     top: '45px',
//     right: '0',
//     backgroundColor: '#fff',
//     border: '1px solid #ddd',
//     borderRadius: '5px',
//     boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
//     padding: '10px',
//     zIndex: 1000,
//     textAlign: 'center',
//     minWidth: '100px',
//   },
//   logoutButton: {
//     backgroundColor: '#dc3545',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     padding: '6px 12px',
//     cursor: 'pointer',
//     fontSize: '0.9em',
//     transition: 'background-color 0.3s',
//     width: '100%',
//   },
//   loading: {
//     fontSize: '1em',
//     color: '#333',
//     textAlign: 'center',
//     marginTop: '20px',
//   },
// };

// export default Profile;
// import React from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// import {
//   Avatar,
//   IconButton,
//   Menu,
//   MenuItem,
//   CircularProgress,
//   Tooltip,
// } from '@mui/material';
// import { AccountCircle } from '@mui/icons-material';

// const Profile = () => {
//   const { loginWithPopup, logout, user, isAuthenticated, isLoading } = useAuth0();
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handleAvatarClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   if (isLoading) {
//     return (
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <CircularProgress />
//       </div>
//     );
//   }

//   return (
//     <div>
//       {!isAuthenticated ? (
//         <Tooltip title="Sign In">
//           <IconButton color="inherit" onClick={() => loginWithPopup()}>
//             <AccountCircle />
//           </IconButton>
//         </Tooltip>
//       ) : (
//         <div>
//           <Tooltip title="Account">
//             <IconButton onClick={handleAvatarClick} size="small" sx={{ ml: 2 }}>
//               <Avatar
//                 src={user?.picture}
//                 alt={user?.name || 'User'}
//                 sx={{ width: 25, height: 25 }}
//               >
//                 {!user?.picture && <AccountCircle />}
//               </Avatar>
//             </IconButton>
//           </Tooltip>
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//             onClick={handleMenuClose}
//             transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//             anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//           >
//             <MenuItem
//               onClick={() =>
//                 logout({ returnTo: window.location.origin })
//               }
//             >
//               Log Out
//             </MenuItem>
//           </Menu>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;


import React, { useEffect } from 'react';
import useAuth from '../../auth/useAuthHook';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAppContext } from '../../AppProvider';
const Profile = ({ leftColumnHeight }) => {
  const { loginWithPopup, logout, user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { setAccessToken } = useAppContext();
  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          console.log("Token:", token);
          setAccessToken(token);
        } catch (error) {
          console.error('Error getting access token:', error);
        }
      }
    };
    getToken();
  }, [isAuthenticated]);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (isLoading) {
    return <CircularProgress />;
  }
  

  return (
    <div>
      {!isAuthenticated ? (
        <Tooltip title="Sign In">
          <IconButton color="inherit" onClick={() => loginWithPopup()}>
            <AccountCircle />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="Account">
            <IconButton onClick={handleAvatarClick}>
              <Avatar
                src={user?.picture}
                alt={user?.name || 'User'}
                sx={{ width: 30, height: 30 }}
              >
                {!user?.picture && <AccountCircle />}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              onClick={() =>
                logout({ returnTo: window.location.origin })
              }
            >
              Log Out
            </MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
};

export default Profile;
