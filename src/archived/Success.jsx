import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AppBar, Toolbar } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import { ACTIVE_BACKEND_URL } from '../config.js';


const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isVerified, setIsVerified] = useState(false);
  const isMdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);



  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId);
      console.log(sessionId)
    }
  }, [sessionId]);


  useEffect(() => {
    if (isVerified) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        navigate("/"); // Redirect to homepage after 5 seconds
      }, 5000);

      return () => clearInterval(interval); // Cleanup timer
    }
  }, [isVerified, navigate]);

  const verifyPayment = async (sessionId) => {
    try {
      const backendUrl = ACTIVE_BACKEND_URL
      const response = await fetch(`${backendUrl}/verify-session/${sessionId}`);
      const data = await response.json();
      
      if (data.status === "paid") {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      setIsVerified(false);
    }
  };

  return (
<div>
      {/* Navbar with Logo */}
      <AppBar position="sticky" sx={{
          backgroundColor: 'white', // White background
          borderBottom: '2px solid #0066FF', // Blue bottom border
          boxShadow: 'none', // Remove default shadow
          marginBottom: '20px'
        }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <a href="https://app.facticity.ai" style={{ textDecoration: 'none' }}>
            <img
              src="/facticityailogo-02.png"
              alt="Facticity.AI"
              style={{
                paddingTop: isMdUp ? '2px' : '3px',
                width: 'auto',
                height: isMdUp ? '32px' : '26px',
              }}
            />
          </a>
        </Toolbar>
      </AppBar>

      {/* Success or Verifying Payment Content */}
      <div className="success-page">
        <div className="container">
          {isVerified ? (
            <div className="success-message">
              <h1>🎉 Payment Successful!</h1>
              <p>
          Thank you for upgrading to <strong>Facticity AI Essential (Pro)! </strong> 
          Your subscription is now active.<br />
          Redirecting back to Facticity AI home page in <strong>{countdown} seconds...</strong>
        </p>              <Button
      variant="contained"
      color="primary"
      component={Link}
      to="/"
      className="cta-button"
    >
      Go to homepage
    </Button>
            </div>
          ) : (
            <div className="verifying-message">
              <h1>Verifying Payment...</h1>
              <p>Please wait while we confirm your payment...</p>
              <div className="spinner">⏳</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Success;
