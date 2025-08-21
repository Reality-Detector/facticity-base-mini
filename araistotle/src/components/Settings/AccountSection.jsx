import React, { useState, useEffect } from 'react';
import { ListItem, ListItemText, Collapse, Card, CardContent } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import ProfileSection from './ProfileSection';
import useAuth from '../../useAuthHook';
import { useAppContext } from '../../AppProvider';
const AccountSection = ({ open, onToggle, profile, idx }) => {
  const [openProfile, setOpenProfile] = useState(true);
  const [isProUser, setIsProUser] = useState(null); // null to indicate loading state
  const [loading, setLoading] = useState(true); // Loading state to handle async request
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth();
  const {backendUrl} = useAppContext();


  const handleToggleProfile = () => {
    setOpenProfile((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch(`${backendUrl}/get_user_subscription_by_email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Validator: 'privy',
            },
            body: JSON.stringify({ email: user.email }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.subscriptions && data.subscriptions.some(sub => sub.status === "active" || sub.status === "trialing")) {
              setIsProUser(true);
            } else {
              setIsProUser(false);
            }
          } else {
            console.error("Failed to fetch subscription status:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching subscription status:", error);
        }
      }
    };

    fetchSubscriptionStatus();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return (
    <>
      <ListItem button onClick={onToggle}>
        <ListItemText primary="Account" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Card variant="outlined" sx={{ mt: 1, mb: 1 }}>
          <CardContent>
            <ListItem button onClick={handleToggleProfile}>
              <ListItemText primary="Profile" />
              {openProfile ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openProfile} timeout="auto" unmountOnExit>
              <ProfileSection profile={profile} idx={idx} />
            </Collapse>
            <ListItem button>
              <ListItemText primary="Subscription" />
              <ListItemText secondary={isProUser ? "Pro User" : "Basic User"} />
            </ListItem>
          </CardContent>
        </Card>
      </Collapse>
    </>
  );
};

export default AccountSection;
