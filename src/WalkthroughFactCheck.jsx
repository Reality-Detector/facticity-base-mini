import React, { useEffect, useState } from "react";
import Joyride from "react-joyride";
import useAuth from './useAuthHook';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";
import { useAppContext } from './AppProvider';


const WalkthroughFactCheck = () => {
  const { user, isAuthenticated } = useAuth();
  const [run2, setRun2] = useState(false);
  const {setSearchQuery, setHighlightSearch} = useAppContext()
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = [
    {
      target: ".facti-tut-step-7",
      content: "Verdict of a fact-check will be displayed as a label.",
    },
    {
      target: ".facti-tut-step-8",
      content: "Short Explanation, Detailed Assessment will be displayed at the top.",
    },
    {
      target: ".facti-tut-step-9",
      content: "List of sources along with the source summary.",
    },
  ];
  

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const step8Element = document.querySelector(".facti-tut-step-8");
  //     if (step8Element) {
  //       clearInterval(interval);
  //       setIsMounted(true);
  //       setRun(true);
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [])


  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const tutorialFactKey = `facticity_fact_tutorial_${user.email}`;
      //const hasSeen = localStorage.getItem(tutorialKey);
      const hasSeen = false

      if (!hasSeen) {
        setTimeout(() => setRun2(true), 1000); // slight delay to allow all components to mount
        localStorage.setItem(tutorialFactKey, "true");
      }
    }
  }, [isAuthenticated, user]);

  

  return  (
    <>
      <Joyride
  steps={steps}
  run={run2}
  stepIndex={stepIndex}
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

/>

    </>
  ) ;
};

export default WalkthroughFactCheck;
