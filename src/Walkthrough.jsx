import React, { useEffect, useState } from "react";
import Joyride from "react-joyride";
import useAuth from './auth/useAuthHook';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";
import { useAppContext } from './AppProvider';
import { usePathname } from "next/navigation";




const Walkthrough = () => {
  
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { user, isAuthenticated } = useAuth();
  const {setSearchQuery, setHighlightSearch, backendUrl, hasSeenTut, run, setRun, forceRun, setForceRun, isProUser} = useAppContext()

  useEffect(() => {
    if (forceRun) {
      setRun(true);
    }
  }, [forceRun]);

  const steps = [
    { target: ".facti-tut-step-1", content: "Welcome to Facticity AI - The best multilingual social media fact-checker." },
    { target: ".facti-tut-step-2", content: "You can fact-check texts, videos, news articles and podcasts. Go through our examples and click on the card to fact-check." },
    {target: ".facti-tut-step-discover", content: "Click on the 'Discover' tab to see fact-checked content from other users and post your own fact-checks to earn Facticity credits as rewards."},
    { target: ".facti-tut-step-3", content: "Click to fact-check trending news topics near you." },
    { target: ".facti-tut-step-5", content: "Configure your fact-checking settings using the options here." },
    { target: ".facti-tut-step-4", content: "Enter a text claim or URL of a Youtube, TikTok, Instagram video or an Apple Podcast as input. We have filled in a news headline for you to fact-check", placement: 'top' },
    { target: ".facti-tut-step-6", content: "Hit the search icon to initiate the fact-check." },
    { target: ".facti-tut-step-sidebar", content: "Explore other features such as the Facticity Writer, API, Subscription Page, Fact-check History and more using the navigation menu," },
    ];

  useEffect(() => {
    if (isAuthenticated && user?.email) {

      if (!hasSeenTut) {
        setTimeout(() => setRun(true), 1000); // slight delay to allow all components to mount
      }
    }
  }, [isAuthenticated, user]);

  const markTutorialAsCompleted = async () => {
    const headers = {
      "Content-Type": "application/json",
      "Validator": "privy",
      "Frontend": "web3"
    };
    
    const res = await fetch("/api/mark-tutorial-complete", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ userEmail: user.email }) // e.g. "auth0|abc123"
    });
  
    if (res.ok) {
      console.log("Tutorial marked as complete");
    } else {
      console.error("Failed to mark tutorial", await res.text());
    }
  };
  

  const handleStepChange = (data) => {
    const { index, action, type } = data;
  
    // "action" is like 'next', 'back'
    // "type" is like 'step:after', 'step:before'
  
    if (type === 'step:after' && index === 3 && action === 'next') {
      // This means user just finished step 5 and clicked "Next"
      // Now we want to prefill the searchbar
  
      const searchInput = document.querySelector(".facti-tut-search-bar-text-field"); // Or whatever your search bar class is
      if (searchInput) {
        //document.querySelector('.facti-tut-search-bar-text-field input').value = 'Trump repealed ObamaCare';
        setSearchQuery("Trump repealed ObamaCare")
      }
    }
    if (action === "next" && index === steps.length - 1) {
        // After the final step (finish button)
        setHighlightSearch(true);  // Trigger highlight
        setTimeout(() => {
          setHighlightSearch(false);  // Remove highlight after 2 seconds
        }, 15000);

        markTutorialAsCompleted()
      }
      const { status } = data;
  if (["finished", "skipped"].includes(status)) {
    setRun(false);
    setForceRun(false); // Reset manual override
  }
  };
  

  return (
    <>
    { (forceRun) && isHomePage && isProUser !== "pro" && (
      <Joyride
  steps={steps}
  run={run}
  continuous
  scrollToFirstStep
  showProgress
  showSkipButton
  styles={{
    options: {
      zIndex: 9999,
      primaryColor: "rgb(0, 102, 255)", // 💙 Change theme color
      //textColor: "#fff", // Text color
      backgroundColor: "#fff", // Background color for tooltips
      overlayColor: "rgba(0, 0, 0, 0.5)", // Dark overlay effect
      spotlightPadding: 5,
    },
    buttonClose: {
      color: "rgb(0, 102, 255)", // Blue close button
    },
    buttonNext: {
      backgroundColor: "rgb(0, 102, 255)", // Blue 'Next' button
      color: "#fff",
    },
    buttonBack: {
      color: "rgb(0, 102, 255)", // Blue 'Back' button
    },
  }}
  locale={{
    last: "Finish", // Change 'Last' button to 'Finish'
  }}
  callback={(data) => handleStepChange(data)}
/> ) }

    </>
  );
};

export default Walkthrough;
