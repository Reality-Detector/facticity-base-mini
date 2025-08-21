import React, { useEffect, useState, useMemo, memo, useCallback, useRef } from 'react';
import { Button, Collapse, Typography, Card, CardContent, Badge, Chip, Box, Grid, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Skeleton, CircularProgress, Snackbar, Alert } from '@mui/material';

import TextField from '@mui/material/TextField';

import './tooltip.css';
import './components/animation.css';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


import YouTubeEmbed from './video';
// import ExpandComponentUpdated from './clicktoexpand_updated';
import { v4 as uuidv4 } from 'uuid';
import { getYoutubeVideoDetails } from './getyoutubetitle';
import VideoProcessingLoader from './videoLoading';
import Fab from '@mui/material/Fab';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { motion } from 'framer-motion';
import FactCheckDisplay from './FactCheckDisplay';
import { useAppContext } from './AppProvider';
import ShareIcon from '@mui/icons-material/Share';
import PodcastEmbed from './podcastEmbed';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TaskScheduledCard from './TaskScheduledCard';
import TaskActions from './InteractionBar';
// import { useRef } from 'react';
import Popover from '@mui/material/Popover';
import DownloadIcon from '@mui/icons-material/Download';
import ClaimSelectionInterface from './ClaimSelectionInterface';

const VideoParagraphComponent = memo(({ id, claim, email, readyin, AccessToken}) => {
  const [expanded, setExpanded] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [value, setValue] = React.useState("");
  const [showTextField, setShowTextField] = useState(false);
  const [assessment, setAssessment] = useState("")
  const [sources, setSources] = useState([])
  const [classification, setClassification] = useState([])
  const [evidence,setEvidence] =useState({})
  const [disambiguation, setDisambiguation] = useState("")
  const [bias, setBias] = useState(null)
  const [ready, setReady] = useState(readyin)
  const [claims, setClaims] = useState([])
  const [showingTaskScheduledCard, setShowingTaskScheduledCard] = useState(false);
  const [count, setCount] = useState({'True':0, 'False':0, 'Inconclusive':0})
  const [total, setTotal] = useState(0)
  const [processedClaims, setProcessedClaims] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Changed to match Grid md breakpoint
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  // const defaultUrl = "https://backend-word-testing-934923488639.us-central1.run.app"
  // const defaultUrl = "https://facticity-backend-a4xncz5jja-as.a.run.app"
  //const defaultUrl = "http://127.0.0.1:8000"
  //const defaultUrl = "https://fastapi-backend-endpoints-934923488639.us-central1.run.app"
  const { claimExtractUrl, setClaimsRecieved, currentConversation, progress, setProgress, userCredits, setPostClaims, backendUrl } = useAppContext();

  const defaultUrl = claimExtractUrl
  const [title, setTitle] = useState("")
  const [showPopup, setShowPopup] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualSource, setManualSource] = useState('');
  const [duration, setDuration] = useState(-1)
  const [recievedclaim, setrecievedclaim] = useState(false)
  const [hoveredId, setHoveredId] = useState(null);
  const [filter, setFilter] = useState("All")
  const [idx, setIdx] = useState(0)
  const {queries, ids, idHistory, workspaceLoading} = useAppContext()
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [showVideoSection, setShowVideoSection] = useState(true);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const shareButtonRef = useRef(null);

  // Email scheduling states
  const [emailRequested, setEmailRequested] = useState(false);
  const [showWaitPopup, setShowWaitPopup] = useState(false);
  const [Emailloading, setEmailloading] = useState(false);
  const [showscheduletask, setShowscheduletask] = useState(false);

  // Add new state for progress details
  const [progressDetails, setProgressDetails] = useState(null);

  // Add new state to control background processes
  const [isProcessingStopped, setIsProcessingStopped] = useState(false);

  // Add new state for delayed loading
  const [showLoader, setShowLoader] = useState(false);

  // Add new state for delayed card display
  const [showScheduledCard, setShowScheduledCard] = useState(false);

  // Add a ref to track the latest claims
  const claimsRef = useRef([]);

  // Update the ref whenever claims changes
  useEffect(() => {
    claimsRef.current = claims;
  }, [claims]);

  // Add new state for claim selection phase
  const [showClaimSelection, setShowClaimSelection] = useState(false);
  const [extractedClaimsForSelection, setExtractedClaimsForSelection] = useState([]);
  const [isInSelectionPhase, setIsInSelectionPhase] = useState(false);



  console.log({progress})
  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setPopoverOpen(true);
        setTimeout(() => {
          setPopoverOpen(false);
        }, 3000);
      })
      .catch((error) => {
        console.error('Failed to copy URL:', error);
      });
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const toggleExpansion = (support) => {
    setExpandedGroups({
      ...expandedGroups,
      [support]: !expandedGroups[support]
    });
  };

  const handleFormExpandClick = () => {
    setShowTextField(true);
  };


  const handlePopupSubmit = () => {
    setTitle(`${manualTitle} by the source: ${manualSource}`);
    setShowPopup(false);
  };

  


  async function sendErrorLog(query, userEmail, message) {
    try {
      const response = await fetch('https://fbdebate-a4xncz5jja-uc.a.run.app/log_error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          userEmail: userEmail,
          message: message
        }),
      });
  
    } catch (error) {
      console.error('Error sending log:', error);
    }
  } 

  async function addTaskId(id) {
    const url = backendUrl+"/add_task_id";
    const data = {
        "_id": id,
        "mode":"extractFacts",
        "link": claim
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${AccessToken}`,
                "Validator": "privy"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return result.task_ids;
    } catch (error) {
        console.error("Failed to add task ID:", error);
    }
}

  async function sendFeedback() {
    // console.log(id)
    try {
      const apiUrl = backendUrl+'/SendDetailedFeedback';
      const requestBody = { id: { id: id }, response: value };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        console.error('Success');
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const setDone = useCallback((claim, classification, output) => {
    setClaims(prevClaims => 
      prevClaims.map(c => 
        c.claim === claim ? { ...c, done: true, classification: classification, output: output } : c
      )
    );
  }, []);

  const addClaims = useCallback(async (newClaims, cached) => {
    setClaims(prevClaims => {
      const updatedClaims = [...prevClaims];
      
      for (let i = 0; i < newClaims.length; i++) {
        const newClaim = newClaims[i];
        const newClaimId = cached ? ids[i] : null;
        const process = cached ? true : false;
        const Classification = idHistory[newClaimId] ? idHistory[newClaimId].Classification : null;

        // Check if claim already exists
        const claimExists = updatedClaims.some(claimObj => claimObj.claim === newClaim);
        
        if (!claimExists) {
          updatedClaims.push({
            claim: newClaim,
            process: process,
            done: cached,
            id: newClaimId,
            classification: Classification,
            output: null
          });
        }
      }
      setPostClaims(newClaims);
      return updatedClaims;
    });
  }, [ids, idHistory]);

  useEffect(() => {
    // Code to run when 'claim' changes
    console.log("Claim changed:", claim);
    setIdx(prevIdx => prevIdx + 1);
    setReady(false);
    // Reset selection phase state
    setShowClaimSelection(false);
    setIsInSelectionPhase(false);
    setExtractedClaimsForSelection([]);
  }, [claim]); // Dependency array
  
  function durationToSeconds(duration) {
    const regex = /P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)D)?T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/;
    const matches = duration.match(regex);
  
    const years = parseInt(matches[1]) || 0;
    const months = parseInt(matches[2]) || 0;
    const days = parseInt(matches[3]) || 0;
    const hours = parseInt(matches[4]) || 0;
    const minutes = parseInt(matches[5]) || 0;
    const seconds = parseInt(matches[6]) || 0;
  
    // Convert all the units to seconds
    const totalSeconds = 
      (years * 31536000) +  // Approximate number of seconds in a year
      (months * 2592000) +  // Approximate number of seconds in a month (30 days)
      (days * 86400) +
      (hours * 3600) +
      (minutes * 60) +
      seconds;
  
    return totalSeconds;
  }
  
  useEffect(() => {
    setrecievedclaim(false)
    console.log({FROM_VIDEO:claim, recieved:recievedclaim})
  }, [claim]);

  useEffect(() => {
    if (isProcessingStopped) return;

    const interval = setInterval(() => {
      const currentClaims = claimsRef.current;
      const processed = currentClaims.filter(c => c.done).length;
      const nextBatchStart = Math.floor(processed / 5) * 5;
      const nextBatchEnd = Math.min(nextBatchStart + 8, currentClaims.length);

      setProcessedClaims(processed);

      setClaims(prevClaims =>
        prevClaims.map((c, index) =>
          index >= nextBatchStart && index < nextBatchEnd
            ? { ...c, process: true }
            : c
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isProcessingStopped]);


const isInitialRender = React.useRef(true);

useEffect(() => {
  const fetchData = async () => {
    // console.log("fetching")
    console.log({queries})
    if (idHistory && Object.keys(idHistory).length > 0) {
      addClaims(queries, true);
      setReady(true);
      setrecievedclaim(true);
      return;
    }
    if (queries.length > 1) {
      addClaims(queries, true);
      setReady(true);
      setrecievedclaim(true);
      return;
    }
    try {

      const apiUrl = backendUrl+'/extract-claim';
      // const apiUrl = 'http://localhost:5000/extract-claim'
      // console.log(apiUrl);
      const requestBody = {
        query: claim,
        location: "",
        timestamp: true,
        userEmail: email,
        requestID: uuidv4(),
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${AccessToken}`, 'Validator':'privy' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        setAssessment(
          "Oops! Something went wrong. Please give us a moment to figure it out."
        );
        setrecievedclaim(true);
        await addClaims([], false);
        setReady(true);
        // sendErrorLog(claim, email, "claim extraction on video failed");
      }

      
      const data = await response.json();
      // console.log(data);

      if (
        data.error === 'You have reached your daily video usage limit.'
      ) {
        setAssessment(
          "You have reached your daily video usage limit. Try again tomorrow."
        );
        // sendErrorLog(
        //   claim,
        //   email,
        //   "Tried video longer than 5 minutes without premium access"
        // );
      } else if (data.status === "bad") {
        setAssessment(data.error);
        // sendErrorLog(claim, email, "Tried video without captions");
      } else if (data.claims.length === 0) {
        console.log("MET")
        setAssessment(
          "Something went wrong with this video. Please try another video. Ensure the selected video is in English and has captions enabled."
        );
      }
      else if (!data.claims) {
        console.log("MET")
        setAssessment(
          "Something went wrong with this video. Please try another video. Ensure the selected video is in English and has captions enabled."
        );
      }
      setrecievedclaim(true);
      if (data.claims.length > 0) {
        setShowscheduletask(true);
        // Show claim selection interface instead of immediately adding claims
        setExtractedClaimsForSelection(data.claims);
        setShowClaimSelection(true);
        setIsInSelectionPhase(true);
      } else {
        await addClaims(data.claims, false);
      }
      setReady(true);
      setClaimsRecieved(true)
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setReady(true)
      addTaskId(currentConversation)
    }
  };


  // if (isInitialRender.current) {
  //   isInitialRender.current = false;
  // } else {
    setClaims([]);
    setCount({ True: 0, False: 0, Inconclusive: 0 });
    // Reset selection phase state
    setShowClaimSelection(false);
    setIsInSelectionPhase(false);
    setExtractedClaimsForSelection([]);
    fetchData();
  // }
}, [claim, queries]);

// Update useEffect for progress checking
useEffect(() => {
  if (isProcessingStopped) return; // Skip if processing is stopped

  if (progress?.taskScheduled) {
    const checkProgress = async () => {
      try {
        const response = await fetch(`${backendUrl}/check_progress?task_id=${currentConversation}`, {
          headers: {
            'Authorization': `Bearer ${AccessToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProgressDetails(data);
          setProgress(data);
        }
      } catch (error) {
        console.error('Error checking progress:', error);
      }
    };

    checkProgress();
    const intervalId = setInterval(checkProgress, 5000);
    return () => clearInterval(intervalId);
  }
}, [progress?.taskScheduled, currentConversation, backendUrl, isProcessingStopped, AccessToken]);

// Add new useEffect to handle the delay
useEffect(() => {
  let timeoutId;
  
  if (progress?.taskScheduled || emailRequested) {
    timeoutId = setTimeout(() => {
      setShowScheduledCard(true);
    }, 500);
  } else {
    setShowScheduledCard(false);
  }

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}, [progress?.taskScheduled, emailRequested]);

const renderClaims = () => {
  // Show claim selection interface if in selection phase
  if (isInSelectionPhase && showClaimSelection) {
    return (
      <Box
        sx={{
          padding: '4px',
        }}
      >
        <ClaimSelectionInterface
          claims={extractedClaimsForSelection}
          onClaimsUpdate={handleClaimsUpdate}
          onStartFactCheck={handleStartFactCheck}
          userCredits={userCredits}
          isVisible={showClaimSelection}
        />
      </Box>
    );
  }

  if ((progress && progress.taskScheduled === true && 
      (!progressDetails || !progressDetails.processed)) || emailRequested) {
    
    if (!showScheduledCard) {
      return null;
    }
    
    return (
      <Box
        sx={{
          padding: '4px',
        }}
      >
        <TaskScheduledCard 
          progressDetails={progressDetails}
          taskId={currentConversation}
          userEmail={email}
          backendUrl={backendUrl}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxHeight: '80vh',
        overflowY: 'auto',
        padding: '4px',
        border: '1px solid #e0e0e0',
        borderRadius: '1px',
        backgroundColor: '#fafafa',
      }}
    >
      {claims
        .filter((claim_i) => {
          if (filter === "All") {
            return true;
          } else if (filter === null) {
            return claim_i.classification === null;
          } else {
            return claim_i.classification === filter;
          }
        })
        .map((claim_i) => (
          <Box key={claim_i.id} mb={2}>
            <FactCheckDisplay 
              query={claim_i.claim} 
              id={claim_i.id} 
              process={claim_i.process} 
              setDone={setDone} 
              done={claim_i.done}
              expandable={true} 
              output={claim_i.output}
              skipDisambiguation={true}
              maxWidth='100%'
              version='pro'
              isVideo={true}
              source_find_mode={false}
              AccessToken={AccessToken}
            />
          </Box>
        ))}
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </Box>
  );
};


  const groupedSources = sources.reduce((acc, source, index) => {
    const support = source.support || 'Unknown';

    if (!acc[support]) {
      acc[support] = [];
    }

    acc[support].push(...source.sources.map(link => link.endsWith(',') ? link.slice(0, -1) : link));

    return acc;
  }, {});

  // const classificationCounts = useMemo(() => {
  //   const counts = claims.reduce(
  //       (acc, claim) => {
  //           acc[claim.classification] = (acc[claim.classification] || 0) + 1;
  //           return acc;
  //       },
  //       { True: 0, False: 0, Inconclusive: 0, Unverifiable: 0 }
  //   );
    
  //   // console.log({claims}); // Log the result
  //   return counts;
  // }, [claims]);


  const classificationCounts = useMemo(() => {
    const currentClaims = claimsRef.current;
    const counts = {
      True: 0,
      False: 0,
      Unverifiable: 0,
    };
  
    currentClaims.forEach((claim) => {
      const classification = claim.classification;
  
      if (classification === "True") {
        counts.True++;
      } else if (classification === "False") {
        counts.False++;
      } else if (classification) {
        counts.Unverifiable++;
      }
    });
  
    return counts;
  }, [claims]);
  


  const isValidApplePodcastUrl = (url) => {
    const applePodcastRegex = /^https?:\/\/podcasts\.apple\.com\/[a-z]{2}\/podcast\/.+\/id\d+(\?i=\d+)?$/;
    return applePodcastRegex.test(url);
  };
  
  
  const isValidYouTubeUrl = (url) => {
      const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
      return youtubeRegex.test(url);
    };


//   useEffect(() => {
//     const fetchVideoTitle = async () => {
//         try {
//             if (isValidUrl(claim)) {
//                 const title = await getYoutubeVideoDetails(claim);
//                 setTitle(`${title.title} by the Youtube channel: ${title.channel}`);
//                 var dur = durationToSeconds(title.duration)
//                 // console.log(`${title.title} by the Youtube channel: ${title.channel} +${title.duration}+${dur}`)
//                 setDuration(dur)
//             } else {
//                 setDuration(60)
//                 // setShowPopup(true);
//             }
//         } catch (error) {
//             setDuration(60)
//             console.error('Error fetching video title:', error);
//             // setShowPopup(true);
//         }
//     };

//     fetchVideoTitle();
// }, [claim]);


useEffect(() => {
  const fetchVideoTitle = async () => {
    try {
      if (isValidYouTubeUrl(claim)) {
        const title = await getYoutubeVideoDetails(claim);
        setTitle(`${title.title} by the Youtube channel: ${title.channel}`);
        const dur = durationToSeconds(title.duration);
        setDuration(dur);
      } else if (isValidApplePodcastUrl(claim)) {
        setDuration(60 * 60); // Default 1 hour for podcast
      } else {
        setDuration(60); // Default 60 seconds for other links
      }
    } catch (error) {
      console.error('Error fetching video title:', error);
      setDuration(60); // Fallback duration
    }
  };

  fetchVideoTitle();
}, [claim]);


const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (e) {
        return false;
    }
};

const handleChipClick = (filter) => {
  // console.log(`Chip clicked: ${filter}`);
  if (filter === 'copy input'){
    navigator.clipboard.writeText(claim); 
  }else{
    setFilter(filter)
  }
  // Add your filtering logic here
};

const handleToggleVideoSection = () => {
  setShowVideoSection(!showVideoSection);
};

const handleEmailMe = async () => {
  if (Emailloading) return;
  
  // Use claimsRef.current instead of claims
  let claims_to_check = claimsRef.current.filter(claim => !claim.done);
  const requiredCredits = claims_to_check.length * 5;

  // Check if user has any credits
  if (userCredits <= 0) {
    setShowWaitPopup(false);
    setSnackbar({
      open: true,
      message: "You don't have any credits available. Please upgrade your plan to continue.",
      severity: 'error'
    });
    return;
  }

  // Check if partial fact check is needed
  if (requiredCredits > userCredits) {
    // Show confirmation dialog for partial fact check
    var partial_fact_check = Math.floor(userCredits/5);
    // Use claimsRef.current instead of claims
    claims_to_check = claimsRef.current.slice(0, partial_fact_check);
    const confirmPartial = window.confirm(
      `You have ${userCredits} credits available. This will allow us to fact check ${partial_fact_check} out of ${claimsRef.current.length} claims. Would you like to proceed with a partial fact check?`
    );
    
    if (!confirmPartial) {
      return;
    }
  }

  setEmailloading(true);

  const payload = {
    currentConversation,
    email,
    claim,
    claims: claims_to_check,
    timestamp: new Date().toISOString(),
    availableCredits: userCredits // Pass available credits to backend
  };

  try {
    const response = await fetch(`https://rdjinpnweu.us-west-2.awsapprunner.com/enqueue-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Server response:", data);
    
    // Stop all background processes
    setIsProcessingStopped(true);
    setShowWaitPopup(false);
    setEmailRequested(true);
    
    // Clear existing claims and reset states
    setClaims([]);
    setProcessedClaims(0);
    setCount({ True: 0, False: 0, Inconclusive: 0 });

  } catch (error) {
    console.error("Error sending email request:", error);
    setSnackbar({
      open: true,
      message: "Error scheduling fact check. Please try again.",
      severity: 'error'
    });
  } finally {
    setEmailloading(false);
  }
};

  // Modify the loading effect
  useEffect(() => {
    let timeoutId;
    
    if (!ready && duration >= 0) {
      // Add a small delay before showing the loader
      timeoutId = setTimeout(() => {
        setShowLoader(true);
      }, 500); // 500ms delay
    } else {
      setShowLoader(false);
    }

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [ready, duration]);

  useEffect(() => {
    if ((progress?.taskScheduled === true && 
        (!progressDetails || !progressDetails.processed)) || emailRequested) {
      setShowingTaskScheduledCard(true);
    } else {
      setShowingTaskScheduledCard(false);
    }
  }, [progress?.taskScheduled, progressDetails, emailRequested]);

  // Add this helper function near the top of the component
  const areAllClaimsDone = (claims) => {
    return claims.length > 0 && claims.every(claim => claim.done);
  };

  const getRemainingClaimsCount = (claims) => {
    return claims.filter(claim => !claim.done).length;
  };
  
  // Add these memoized functions near the top of the component
  const remainingClaimsAndCredits = useMemo(() => {
    const remainingClaims = claims.filter(claim => !claim.done);
    return {
      count: remainingClaims.length,
      credits: remainingClaims.length * 5
    };
  }, [claims]);

  const shouldShowScheduleChip = useMemo(() => {
    return !showingTaskScheduledCard && 
           !isInSelectionPhase &&
           showscheduletask && 
           claims.length > 0 && 
           !claims.every(claim => claim.done);
  }, [showingTaskScheduledCard, isInSelectionPhase, showscheduletask, claims]);

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(`${backendUrl}/generate-pdf-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: currentConversation }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = 'facticity_report.pdf';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: 'PDF report downloaded successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setSnackbar({
        open: true,
        message: 'Failed to download PDF report',
        severity: 'error'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Handler functions for claim selection interface
  const handleClaimsUpdate = (updatedClaims) => {
    setExtractedClaimsForSelection(updatedClaims);
  };

  const handleStartFactCheck = async (selectedClaims) => {
    setShowClaimSelection(false);
    setIsInSelectionPhase(false);
    await addClaims(selectedClaims, false);
  };

  return (
    <Card 
      variant="outlined" 
      p={0} 
      sx={{
        fontFamily: 'IBM Plex Sans',
      }}
    >
    <CardContent>
      
      <Grid
          container
          spacing={2}
          sx={{
            width: '100%',
            flexDirection: { xs: 'column', md: 'row' },  // keep column on mobile, row on desktop
            flexWrap: { xs: 'wrap', md: 'nowrap' }       // ⬅️ new: don’t allow wrap on desktop
          }}
        >
        {/* Video/Content Section - Left side on desktop, full width on mobile */}
        <Grid
        item
        xs={12}
        md={4}
        sx={{
          display: isMobile && !showVideoSection ? 'none' : 'block',
          flexBasis: { xs: '100%', md: '33.333333%' }, // keep basis for sizing
          maxWidth:  { xs: '100%', md: '33.333333%' }, // keep for consistency
          width:     { xs: '100%', md: '33.333333%' }, // already present
        }}
      >
          {isValidYouTubeUrl(claim) ? (
            <YouTubeEmbed videoLink={claim} height={'30vh'} />
          ) : isValidApplePodcastUrl(claim) ? (
            <PodcastEmbed podcastLink={claim} height={'30vh'} />
          ) : (
              <Typography variant="body1">
                <span
                  dangerouslySetInnerHTML={{ __html: claim }}
                  style={{
                    display: "block", // Makes the span behave like a block element
                    maxHeight: "200px", // Adjust this value as needed
                    overflowY: "auto", // Enables vertical scrolling
                    overflowX: "hidden", // Prevents horizontal scrolling (can change to "auto" if needed)
                  }}
                />
              </Typography>
          )}
          <Typography gutterBottom>
            {title}
          </Typography>
          <Box 
            display="flex" 
            flexWrap="wrap" 
            justifyContent="flex-start"
          >
            {!showingTaskScheduledCard && !isInSelectionPhase && (
              <>
                <Chip
                  label={`SHOW ALL (${claims.length})`}
                  sx={{ backgroundColor: '#A2AAAD', color: 'white', marginRight: '2px', marginBottom: '2px', fontSize: '0.75rem'}}
                  onClick={() => handleChipClick('All')}
                />
                <Chip
                  label={`TRUE (${classificationCounts.True})`}
                  sx={{ backgroundColor: '#34C759', color: 'white', marginRight: '2px', marginBottom: '2px', fontSize: '0.75rem'}}
                  onClick={() => handleChipClick('True')}
                />
                <Chip
                  label={`FALSE (${classificationCounts.False})`}
                  sx={{ backgroundColor: '#FF3B30', color: 'white', marginRight: '2px', marginBottom: '2px', fontSize: '0.75rem'}}
                  onClick={() => handleChipClick('False')}
                />
                <Chip
                  label={`UNVERIFIABLE (${classificationCounts.Unverifiable})`}
                  sx={{ backgroundColor: '#FF9500', color: 'white', marginRight: '2px', marginBottom: '2px', fontSize: '0.75rem'}}
                  onClick={() => handleChipClick('Unverifiable')}
                />
              </>
            )}

            {shouldShowScheduleChip && (
              <Tooltip title={`Requires ${remainingClaimsAndCredits.credits} credits. You have ${userCredits} credits available.`}>
                <Chip
                  label={`Schedule this fact check (${remainingClaimsAndCredits.credits} credits)`}
                  sx={{ 
                    backgroundColor: userCredits > 0 ? '#A2AAAD' : '#d32f2f', 
                    color: 'white', 
                    marginRight: '2px', 
                    marginBottom: '2px', 
                    fontSize: '0.75rem' 
                  }}
                  onClick={() => userCredits > 0 ? setShowWaitPopup(true) : null}
                  disabled={userCredits <= 0}
                />
              </Tooltip>
            )}

            {!shouldShowScheduleChip && !showingTaskScheduledCard && !isInSelectionPhase && (
              <Chip
                icon={isDownloading ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
                label={isDownloading ? "DOWNLOADING..." : "DOWNLOAD PDF"}
                sx={{ 
                  backgroundColor: '#2196F3', 
                  color: 'white', 
                  marginRight: '2px', 
                  marginBottom: '2px', 
                  fontSize: '0.75rem',
                  opacity: isDownloading ? 0.7 : 1,
                  '&:hover': {
                    backgroundColor: '#1976D2',
                  },
                  '& .MuiChip-icon': {
                    color: 'white',
                    marginLeft: '8px',
                  },
                  '& .MuiChip-label': {
                    paddingLeft: '4px',
                  },
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              />
            )}

            <Chip
              label={`COPY INPUT`}
              sx={{ backgroundColor: '#A2AAAD', color: 'white', marginRight: '2px', marginBottom: '2px', fontSize: '0.75rem'}}
              onClick={() => handleChipClick('copy input')}
            />

          <Tooltip title="Share">
          <TaskActions task_id={"longcheck"} userEmail={email} showRatingButtons={false}/>
        </Tooltip>
          </Box>
        </Grid>
        
        {/* Claims Section - Right side on desktop, full width on mobile */}
        <Grid 
          item 
          xs={12} 
          md={8}
          sx={{
            width: { xs: '100%', md: '66.666667%' }, // Explicit width control
            flexBasis: { xs: '100%', md: '66.666667%' },
            maxWidth: { xs: '100%', md: '66.666667%' }
          }}
        >
          {showLoader && (
            <VideoProcessingLoader 
              videoDuration={duration} 
              done={recievedclaim} 
              claim={claim} 
              idx={idx}
            />
          )}
          <Typography variant="body1" gutterBottom>
            {assessment}
          </Typography>
          {isMobile && (
            <Box 
              width="100%" 
              display="flex" 
              justifyContent="center" 
              onClick={handleToggleVideoSection}
              sx={{
                cursor: 'pointer',
                py: 0.5,
                borderBottom: '1px solid #E0E0E0',
                color: '#606060',
                fontSize: '0.75rem',
                fontFamily: 'Arial',
                userSelect: 'none',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              {showVideoSection ? "─── hide content above ───" : "─── show content ───"}
            </Box>
          )}
          <Box>
            {renderClaims()}
          </Box>
        </Grid>

      </Grid>
      <Popover
        open={popoverOpen}
        anchorEl={shareButtonRef.current}
        onClose={() => setPopoverOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        disableRestoreFocus
        PaperProps={{
          sx: {}
        }}
      >
        <Alert
          onClose={() => setPopoverOpen(false)}
          severity="success"
          sx={{ width: '200px' }}
        >
          Link copied!
        </Alert>
      </Popover>
    </CardContent>

    { /* Popup dialog for scheduling */ }
    <Dialog
      open={showWaitPopup}
      onClose={() => setShowWaitPopup(false)}
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: 'sm',
          px: 1,
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6">
          Schedule Fact Check
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText>
          We'll fact check all these claims and send you a link via email when it's ready.
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ pb: 2, px: 2 }}>
        <Button 
          onClick={() => setShowWaitPopup(false)} 
          variant="outlined" 
          color="inherit"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleEmailMe} 
          variant="contained" 
          color="primary"
          disabled={Emailloading}
        >
          {Emailloading ? <CircularProgress size={24} color="inherit" /> : "Schedule"}
        </Button>
      </DialogActions>
    </Dialog>

    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={() => setSnackbar({...snackbar, open: false})}
    >
      <Alert 
        onClose={() => setSnackbar({...snackbar, open: false})} 
        severity={snackbar.severity}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  </Card>
  );
});

export default VideoParagraphComponent;