import React, { useEffect } from "react";
import useAuth from '../useAuthHook';
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { useAppContext } from "../AppProvider";

// Custom hook to parse query parameters
function useQuery() {
  return new URLSearchParams(window.location.search);
}

// Enhanced Divider with centered text
const DividerWithText = ({ text }) => (
  <Box display="flex" alignItems="center" width="100%" my={2}>
    <Divider sx={{ flexGrow: 1 }} />
    <Typography
      variant="body2"
      sx={{ mx: 2, whiteSpace: "nowrap", color: "#5D5D5D" }}
    >
      {text}
    </Typography>
    <Divider sx={{ flexGrow: 1 }} />
  </Box>
);

const LoginModal = ({ open, handleClose, setShowSignUpModal, titleText = "Login required", bodyText = "Please log in or create an account to continue." }) => {
  const { loginWithPopup } = useAuth();
  const query = useQuery();

  const { overlayLogin } = useAppContext();

  // Debug log to check overlayLogin value
  console.log('LoginModal - overlayLogin value:', overlayLogin);

  useEffect(() => {
    const error = query.get("error");
    const errorDescription = query.get("error_description");

    if (error === "access_denied") {
      // notify(decodeURIComponent(errorDescription)); // This line was removed from the new_code, so it's removed here.
      // console.log(decodeURIComponent(errorDescription));
    }
  }, [query]); // Removed notify from dependency array as it's no longer imported.

  const handleLogin = async () => {
    try {
      await loginWithPopup();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  console.log('LoginModal - Rendering Dialog with open:', overlayLogin);
  
  return (
    <Dialog
      open={overlayLogin}
      // Disable closing the modal by clicking outside or pressing escape
      disableEscapeKeyDown
      // Prevent closing on backdrop click by not handling onClose
      onClose={() => {}}
      PaperProps={{
        sx: {
          minHeight: { xs: "auto", sm: "400px" },
          minWidth: { xs: "90vw", sm: "400px" },
          maxWidth: { xs: "95vw", sm: "400px" },
          borderRadius: 4,
          // Remove boxShadow
          boxShadow: "none",
          // Optional: Add a border or other styles if needed
          border: "1px solid #e0e0e0",
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          sx={{ p: { xs: 1, sm: 2 } }}
        >
          {/* Logo and Title Section */}
          <Box
            sx={{
              mb: { xs: 2, sm: 3 },
              textAlign: "center",
              backgroundColor: "#FFFFFF",
              padding: { xs: 2, sm: 3 },
              borderRadius: 2,
              // Remove boxShadow
              boxShadow: "none",
              width: "100%",
            }}
          >
              <a href="https://facticity.ai" style={{ textDecoration: 'none' }}>
                  <img
                  src="/facticityailogo-02.png"
                  alt="Facticity.AI"
                  style={{
                      paddingTop: '12px',
                      width: 'auto',
                      height: '40px',
                  }}
                  />
              </a>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#5D5D5D",
                fontSize: { xs: "16px", sm: "18px" },
                fontWeight: 400,
                lineHeight: 1.2,
                mt: 1,
              }}
            >
              Recognized by TIME's Best Inventions of 2024
            </Typography>
          </Box>

          {/* Sign-In Section */}
          <Box
            sx={{
              backgroundColor: "#FFFFFF",
              padding: { xs: 2, sm: 3 },
              borderRadius: 2,
              // Remove boxShadow
              boxShadow: "none",
              width: "100%",
              textAlign: "left",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 500, mb: 0.5, fontSize: { xs: "20px", sm: "24px" } }}>
              Sign In &
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, color: "#5D5D5D", mb: 2, fontSize: { xs: "16px", sm: "18px" } }}
            >
              Let's Get Fact-Checking
            </Typography>
            <Button
                onClick={handleLogin}
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  backgroundColor: "#0066FF",
                  color: "#FFFFFF",
                  padding: { xs: 1.2, sm: 1.5 },
                  fontSize: { xs: "14px", sm: "16px" },
                  fontWeight: 600,
                  textTransform: "none", // Ensures the text remains lowercase
                  borderRadius: "30px", // Adds rounded edges
                  "&:hover": {
                    backgroundColor: "#46564d", // Slightly different shade for hover
                  },
                  mb: 1.5,
                }}
              >
                Continue with email (free)
              </Button>

          </Box>

          {/* Divider with Text */}
          <DividerWithText text="Please sign up for daily pro features." />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
