import React, { useState, useEffect, useRef } from 'react';
import {
    Typography,
    Paper,
    Card,
    CardContent,
    Button,
    Chip,
    TextField,
    Skeleton,
    Grow,
    Collapse,
    IconButton,
    Grid,
    Divider,
    useMediaQuery,
    useTheme,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Box
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { marked } from 'marked';
import { useAppContext } from '../../AppProvider';
import { createAndCheckTask } from '../../utils/runasyncqueries';
import ReplayIcon from '@mui/icons-material/Replay';
import { v4 as uuidv4 } from 'uuid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import ExpandMoreIcon
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; // Import ExpandLessIcon
import useAuth from '../../auth/useAuthHook';
import PropTypes from 'prop-types';
import TaskActions from '../Interactions/InteractionBar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ScatterPlot from './plot';
import axios from "axios";
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Constants
const ITEMS_PER_PAGE = 4;

const DUCKDUCKGO_API = 'https://api.allorigins.win/raw?url=';

// Utility Functions
const getDomain = (url) => {
    try {
        const { hostname } = new URL(url);
        return hostname;
    } catch (e) {
        console.error("Invalid URL:", url);
        return '';
    }
};

const fetchDuckDuckGo = async (query) => {
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const url = `${DUCKDUCKGO_API}${encodeURIComponent(searchUrl)}`;
    try {
        const response = await fetch(url, { method: 'GET' });
        const html = await response.text();

        const results = [];
        const regex = /<h2[^>]*class="[^"]*result__title[^"]*"[^>]*>.*?<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>.*?<\/h2>.*?<a[^>]+class="result__snippet"[^>]*>(.*?)<\/a>/gs;

        const matches = [...html.matchAll(regex)];
        matches.slice(0, 5).forEach(match => {
            const url = match[1];
            const title = match[2].replace(/<[^>]+>/g, ''); // Remove HTML tags
            const snippet = match[3].replace(/<[^>]+>/g, ''); // Remove HTML tags
            results.push({ title, url, snippet });
        });
        return results;
    } catch (error) {
        console.error("Error fetching results from DuckDuckGo:", error);
        return [];
    }
};




// async function updateProSearches(userEmail) {
//     try {
//       const response = await axios.post(`${backendUrl}/update_pro_searches`, {
//         userEmail: userEmail, // Pass the logged-in user's email
//       });

//       if (response.data.success) {
//         console.log("Pro search count updated successfully:", response.data.message);
//       } else {
//         console.error("Failed to update pro search count:", response.data.error);
//       }
//     } catch (error) {
//       console.error("Error while updating pro search count:", error.message);
//     }
//   }
// Subcomponents

const ClarificationSection = ({
    clarification,
    options,
    clarificationAnswer,
    onAnswerChange,
    onSubmit,
    onSkip,
}) => (
    <div style={{ marginTop: '20px' }}>
        <Typography variant="subtitle1" fontWeight="bold" textAlign="left">
            Clarification Needed:
        </Typography>
        <Typography variant="body1" marginTop="10px" textAlign="left">
            {clarification}
        </Typography>

        {/* Options as buttons */}
        {options && options.map((option, index) => (
            <Button
                key={index}
                variant="outlined"
                color="primary"
                onClick={() => onSubmit(option)}
                style={{ marginTop: '10px', marginRight: '10px' }}
            >
                {option}
            </Button>
        ))}

        {/* Text input field */}
        <TextField
            label="Your Answer"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={clarificationAnswer}
            onChange={onAnswerChange}
            style={{ marginTop: '10px' }}
        />

        {/* Submit and Skip buttons */}
        <div style={{ marginTop: '10px' }}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => onSubmit(clarificationAnswer)}
                style={{ marginRight: '10px' }}
            >
                Submit Clarification
            </Button>
            <Button
                variant="outlined"
                color="secondary"
                onClick={onSkip}
            >
                Skip
            </Button>
        </div>
    </div>
);


const SourceCard = ({ step, index, tags, userEmail, blurred = false }) => {
    const { loginWithRedirect } = useAuth();

    const handleLogin = async () => {
        try {
            await loginWithRedirect();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const domain = getDomain(step.link);
    const faviconUrl = domain
        ? `https://www.google.com/s2/favicons?domain=${domain}`
        : '';

    return (
        <div style={{ position: 'relative' }}>
            {/* Blurred Card Content */}
            <div
                style={{
                    filter: blurred ? 'blur(4px)' : 'none',
                    pointerEvents: blurred ? 'none' : 'auto',
                }}
            >
                <Grow
                    in={true}
                    style={{ transformOrigin: '0 0 0' }}
                    {...(true ? { timeout: 500 + index * 300 } : {})}
                >
                    <Card variant="outlined" style={{ position: 'relative' }}>
                        {/* Outcome Label */}
                        {step.outcome && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    backgroundColor:
                                        step.outcome === 'true'
                                            ? '#C8E6C9'
                                            : step.outcome === 'false'
                                            ? '#FFCDD2'
                                            : '#E0E0E0',
                                    color: '#000',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    textTransform: 'capitalize',
                                    fontFamily: 'Arial, sans-serif',
                                    zIndex: 1,
                                }}
                            >
                                {step.outcome === 'true'
                                    ? 'Supporting'
                                    : step.outcome === 'false'
                                    ? 'Counter Argument'
                                    : 'Neutral'}
                            </div>
                        )}

                        <CardContent style={{ paddingTop: step.outcome ? '32px' : '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                {faviconUrl && (
                                    <img
                                        src={faviconUrl}
                                        alt={`${step.source} logo`}
                                        style={{ width: '16px', height: '16px', marginRight: '6px' }}
                                    />
                                )}
                                {step.link ? (
                                    <Typography variant="body2" color="textSecondary">
                                        <a
                                            href={step.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: 'none', color: '#1976d2' }}
                                        >
                                            {step.source} | {step.title}
                                        </a>
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        {step.source} | {step.title}
                                    </Typography>
                                )}
                            </div>
                            {step.summary && (
                                <Typography variant="body1" style={{ marginTop: '5px' }}>
                                    {step.summary}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grow>
            </div>

            {blurred && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: '#fff',
                        fontSize: '16px',
                        textAlign: 'center',
                        padding: '10px',
                        boxSizing: 'border-box',
                    }}
                >
                    <div>
                        {userEmail === "" ? (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={handleLogin}
                                    sx={{
                                        backgroundColor: "#0066FF",
                                        borderRadius: "30px",
                                        boxShadow: "none",
                                        textTransform: 'none',
                                        "&:hover": {
                                            backgroundColor: "#0056D6",
                                            boxShadow: "none",
                                        },
                                    }}
                                >
                                    Sign In
                                </Button>
                                <p onClick={handleLogin}>
                                    to view all sources and enjoy more Free and Pro fact-checks
                                </p>
                            </>
                        ) : tags.isPro ? (
                            <p>Your daily credits is 0. Come back tomorrow for more fact checks.</p>
                        ) : (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() => (window.location.href = '/subscription')}
                                    sx={{
                                        backgroundColor: "#0066FF",
                                        borderRadius: "30px",
                                        boxShadow: "none",
                                        textTransform: 'none',
                                        "&:hover": {
                                            backgroundColor: "#0056D6",
                                            boxShadow: "none",
                                        },
                                    }}
                                >
                                    Upgrade
                                            </Button>

                                    <Button
                                    variant="contained"
                                    onClick={() => (window.location.href = '/referral')}
                                    sx={{
                                    ml : 2,
                                    borderRadius: "30px",
                                    textTransform: 'none',
                                    backgroundColor: "#0066FF",
                                    "&:hover": {
                                            backgroundColor: "#0056D6",
                                            boxShadow: "none",
                                        },
                                    }}
                                >
                                    Refer a Friend
                                </Button>

                                <p style={{ marginTop: '12px' }}>
                                    Upgrade your plan or refer a friend to earn more daily credits and fact checks.
                                </p>
                    </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


SourceCard.propTypes = {
    step: PropTypes.shape({
    link: PropTypes.string,
    source: PropTypes.string.isRequired,
    summary: PropTypes.string,
    }).isRequired,
    index: PropTypes.number.isRequired,
    blurred: PropTypes.bool,
};

const PaginationControls = ({ currentPage, totalPages, onPrevious, onNext }) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button
            onClick={onPrevious}
            disabled={currentPage === 1}
            style={{ marginRight: '10px', border: 'none', minWidth: 0, padding: 0 }}
        >
            <ArrowBackIcon />
        </Button>
        <Typography variant="body2" style={{ display: 'flex', alignItems: 'center' }}>
            Page {currentPage} of {totalPages}
        </Typography>
        <Button
            onClick={onNext}
            disabled={currentPage === totalPages}
            style={{ marginLeft: '10px', border: 'none', minWidth: 0, padding: 0 }}
        >
            <ArrowForwardIcon />
        </Button>
    </div>
);

function getRenderingOptions(creditsLeft, isPro, userEmail) {
    const outOfCredits = creditsLeft <= 0;
    const notLoggedIn = false;
  
    let message = null;
    let button = null;
  
    if (notLoggedIn) {
      message = "Please log in for free daily fact checks.";
      button = "login";
    } else if (outOfCredits) {
      message = isPro
        ? "Your daily credits will refresh tomorrow, so come back tomorrow for more."
        : "Your daily credits will refresh tomorrow. Subscribe to Pro for more daily credits.";
      button = "subscription";
    }
  
    return {
      limitSource: outOfCredits,
      blur: outOfCredits,
      hideDisambiguation: outOfCredits,
      truncateExplanation: outOfCredits,
      hideBias: outOfCredits,
      message: message,
      button: button,
      isPro: isPro
    };
  }
  
  
  function truncateWithMessage(text, message = '', length = 300) {
    if (!text) return message || '';
    const truncated = text.length > length ? text.slice(0, length) + '...' : text;
    return truncated;
}
  
// New component for reward popup
const RewardPopup = ({ open, onClose, taskId, userEmail, backendUrl, interactionBarRef, onPermanentDisable, scrollToInteractionBar }) => {
    const [loading, setLoading] = useState(false);

    const handleEarnCredits = () => {
        onClose();
        // Scroll to the interaction bar with smooth animation
        scrollToInteractionBar();
    };

    const handleCancel = () => {
        // Call the function to permanently disable the popup
        onPermanentDisable();
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    padding: '8px',
                    maxWidth: '450px'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pb: 1
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmojiEventsIcon sx={{ color: '#FFD700', mr: 1 }} />
                    <Typography variant="h6">Earn More Credits!</Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Share your fact check or give feedback to earn additional credits. This helps us improve and expand our services.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', pb: 2, px: 3 }}>
                <Button 
                    onClick={handleCancel} 
                    sx={{ 
                        borderRadius: '20px', 
                        px: 3, 
                        textTransform: 'none',
                        color: '#666'
                    }}
                >
                    Don't Show Again
                </Button>
                <Button 
                    onClick={handleEarnCredits} 
                    variant="contained"
                    sx={{ 
                        borderRadius: '20px', 
                        px: 3, 
                        textTransform: 'none',
                        bgcolor: '#0066FF',
                        '&:hover': {
                            bgcolor: '#0052CC'
                        }
                    }}
                >
                    Earn Credits
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Main Component
const FactCheckDisplay = ({ query, id, process, setDone, skipDisambiguation, maxWidth = "1000px", expandable = false, output = null, done = false, version, isVideo, source_find_mode, AccessToken}) => {
    // State Variables
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [steps, setSteps] = useState([]);
    const [sortedSteps, setSortedSteps] = useState([]);
    const lastSearchedQueryRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [clarification, setClarification] = useState(null);
    const [clarificationAnswer, setClarificationAnswer] = useState('');
    const [isAwaitingClarification, setIsAwaitingClarification] = useState(false);
    const [factDisplay, setFactDisplay] = useState(query);
    const [options, setOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [expanded, setExpanded] = useState(false); // State for expansion
    const [taskId, setTaskId] = useState("")
    const [disambisOpen, setDisambIsOpen] = useState(false);
    const [biasisOpen, setBiasIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState("")
    const [tags, setTags] = useState({})
    const [visualisationMode, setVisualisationMode] = useState({})
    const [disableRetry, setDisableRetry] = useState(false)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // adjust breakpoint as needed

    // Add new state for the reward popup
    const [showRewardPopupDialog, setShowRewardPopupDialog] = useState(false);
    
    // Add ref for the interaction bar
    const interactionBarRef = useRef(null);
    
    // Add ref for the overall assessment section
    const overallAssessmentRef = useRef(null);

    const { 
        toggleSkipDisambiguation, 
        setVersion, 
        setIds, 
        currentConversation, 
        idHistory, 
        setIdHistory, 
        email, 
        mode, 
        link, 
        isProUser, 
        setSeekto, 
        setSeekTrigger, 
        backendUrl, 
        userCredits, 
        setUserCredits, 
        dailyUserCredits,
        setDailyUserCredits,
        dailyTaskCredits,
        setDailyTaskCredits,
        CommunityCredits,
        setCommunityCredits,
        showRewardPopup,
        setShowRewardPopup,
        distributedUrl
    } = useAppContext();

    const DISAMBIGUATE_URL = backendUrl +'/disambiguate';
    const MODIFYQUERY_URL = backendUrl +'/modifyquery';
    
    const toggleDisambSection = () => {
        setDisambIsOpen((prev) => !prev);
    };

    const toggleBiasSection = () => {
        setBiasIsOpen((prev) => !prev);
    };

    const itemsPerPage = ITEMS_PER_PAGE;
    const totalPages = Math.ceil(sortedSteps.length / itemsPerPage);

    // Handlers for Pagination
    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };


    async function updateProSearches(userEmail) {
        try {
        const response = await axios.post(backendUrl+"/update_pro_searches", {
            userEmail: userEmail, // Pass the logged-in user's email
        });
    
        if (response.data.success) {
            console.log("Pro search count updated successfully:", response.data.message);
        } else {
            console.error("Failed to update pro search count:", response.data.error);
        }
        } catch (error) {
        console.error("Error while updating pro search count:", error.message);
        }
    }
    // Subcomponents


    useEffect(() => {
        var tag = getRenderingOptions(visualisationMode.userCredits, visualisationMode.isPro, email)
        setTags(tag);
      }, [visualisationMode, setTags]); 

      useEffect(() =>{
        //in SearchComponent.js, update the variable called 'setToastOpen'
        if(userCredits == 0)
        {

        }
      }, [userCredits])

      

    // Get current items for pagination
    const currentItems = sortedSteps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



    const stepQueue = [];
    let isProcessing = false;

    const processQueue = () => {
        if (stepQueue.length === 0) {
            isProcessing = false;
            return;
        }
        
        isProcessing = true;
        const nextStep = stepQueue.shift();
        setCurrentStep(nextStep);
        
        setTimeout(() => {
            processQueue();
        }, 3000); // Minimum 3 seconds delay
    };

    // Function to add new steps
    const addMessage = (message, type = "steps", delay = 2000) => {
        if (type === "steps") {
            setSteps(message);
        } else {
            stepQueue.push(message);
            if (!isProcessing) {
                processQueue();
            }
        }
    };
    

    const { loginWithRedirect, logout, user } = useAuth();

    const handleLogin = async () => {
        try {
            await loginWithRedirect();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const setSeekTofunc = (seconds) => {
        // Implement your seeking logic here
        console.log(`Seeking to ${seconds} seconds`);
        setSeekto(seconds)
        setSeekTrigger(prev => !prev);
    };
    

    async function addTaskId(id, taskId) {
        const url = backendUrl+"/add_task_id";
        const data = {
            "_id": id,
            "task_id": taskId,
            "mode":mode,
            "link":link
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

    async function addCachedTasktodB(id, input, result) {
        
        const url = backendUrl+"/add_cache_db";
        result['userEmail'] = email
        const data = {
            "_id": id,
            "input": input,
            'result': result
        };
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
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

    // handleRedo function
    const handleRedo = () => {
        setError(null);
        performSearch(query)
    };

    // Function to show the reward popup
    const handleShowRewardPopup = () => {
        // Only show the popup if:
        // 1. The user is logged in (has email) 
        // 2. showRewardPopup is true in context
        // 3. Not in expandable mode (expandable is false)
        if (email && showRewardPopup && !expandable) {
            setShowRewardPopupDialog(true);
        }
    };

    // Function to permanently disable the reward popup
    const handlePermanentDisable = () => {
        // Update the app context to permanently disable the popup
        setShowRewardPopup(false);
    };

    // Function to scroll to the interaction bar with highlight effect
    const scrollToInteractionBar = () => {
        if (interactionBarRef && interactionBarRef.current) {
            interactionBarRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            
            // Add a highlight effect to draw attention
            const element = interactionBarRef.current;
            element.style.transition = 'box-shadow 0.3s ease';
            element.style.boxShadow = '0 0 15px rgba(0, 102, 255, 0.6)';
            
            // Remove highlight after a delay
            setTimeout(() => {
                element.style.boxShadow = 'none';
            }, 2000);
        }
    };

    // Function to scroll to the overall assessment with highlight effect
    const scrollToOverallAssessment = () => {
        if (overallAssessmentRef && overallAssessmentRef.current) {
            overallAssessmentRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            
            // Add a highlight effect to draw attention
            const element = overallAssessmentRef.current;
            element.style.transition = 'box-shadow 0.3s ease';
            element.style.boxShadow = '0 0 15px rgba(0, 102, 255, 0.6)';
            
            // Remove highlight after a delay
            setTimeout(() => {
                element.style.boxShadow = 'none';
            }, 2000);
        }
    };

    // Function to perform the final search
    const performSearch = async (finalQuery) => {
        // console.log("perform search initiated")
        if (output){
            // console.log({output})
            setResult(output);
            setTaskId(output['task_id'])
            setSteps(output['intermediate_steps'])
        

            if (output['intermediate_steps']) {
                if (output['intermediate_steps'].length === 0) {
                    setSortedSteps([])
                }
            } else {
                setSortedSteps([])
            }
            

            
            return
        }
        else if (idHistory[id]) {
            setResult(idHistory[id]);
            setSteps(idHistory[id]['intermediate_steps'])
            setTaskId(idHistory[id]['task_id'])
            setVisualisationMode(idHistory[id]['visualisationMode'])

            if (idHistory[id]['intermediate_steps']) {
                if (idHistory[id]['intermediate_steps'].length === 0) {
                    setSortedSteps([])
                }
            } else {
                setSortedSteps([])
            }

            setDone(finalQuery, idHistory[id].Classification, idHistory[id])
            return; // Exit the function early if we already have the result
        } else {
            // You can add additional logic here if needed
        }

        setLoading(true);
        console.log("distributedUrl fact check display", distributedUrl)
        try {
            const { output, error: taskError } = await createAndCheckTask(
                finalQuery,
                "location",
                new Date().toISOString(),
                email,
                "speaker",
                "",
                version,
                addMessage,
                distributedUrl,
                source_find_mode,
                setVisualisationMode,
                isVideo,
                AccessToken
            );
            
            console.log({output})
            if(output.visualisationMode){
                setUserCredits(output.visualisationMode.userCredits || 0)     
                setDailyUserCredits(output.visualisationMode.dailyCredits || 0)
                setDailyTaskCredits(output.visualisationMode.lifetimeCredits || 0) 
                setCommunityCredits(output.visualisationMode.communityCredits || 0)
            }

            console.log({output})
            if (output?.sourceCount === 0 && output?.new_search === true) {
                handleRedo();
                setDisableRetry(true);
                return;
            }

            if (taskError || (output?.Classification === "")) {

                if (output?.overall_assessment === "user does not have credits left to proceed further fact-checking."){
                    setCurrentStep(output.overall_assessment);
                    setError(output.overall_assessment);
                    setDisableRetry(true)
                }else{
                    handleRedo()
                    setDisableRetry(true)
                    setCurrentStep("An error occurred while processing the query. trying again.");
                    setError("An error occurred while processing the query. trying again.");
                }
                console.error(taskError);
                setLoading(false);
            } else {
                setCurrentStep("")
                setResult(output);
                setLoading(false);

                if (output.task_id) {
                    setTaskId(output.task_id)
                    setIds((predIds) => [...predIds, output.task_id]);
                    await addTaskId(currentConversation, output.task_id)
                    setIdHistory((prevHistory) => ({
                        ...prevHistory,
                        [output.task_id]: output
                    }));
                } else {
                    const newId = uuidv4(); // Avoid shadowing the 'id' prop
                    setTaskId(newId)
                    setIds((predIds) => [...predIds, newId]);
                    await addTaskId(currentConversation, newId)
                    setIdHistory((prevHistory) => ({
                        ...prevHistory,
                        [newId]: output
                    }));
                    try{
                        await addCachedTasktodB(newId, query, output)
                    }catch{
                        console.log("l")
                    }
                    
                    // Optionally update idHistory here
                }
                output['intermediate_steps'] = sortedSteps
                setDone(query, output.Classification, output)
                setError(null);
                // Show reward popup after a short delay if enabled
                console.log("show reward popup")
                // Show reward popup after a short delay if enabled
                scrollToOverallAssessment();
                setTimeout(() => {
                    handleShowRewardPopup();
                }, 5000);


                
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            handleRedo()
            setDisableRetry(true)
            console.error(err);
        } finally {
            setLoading(false);
            setIsAwaitingClarification(false);

        }
    };

    // Function to handle disambiguation
    const handleDisambiguate = async () => {
        setLoading(true);
        try {
            const response = await fetch(DISAMBIGUATE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AccessToken}`
                },
                body: JSON.stringify({ query }),
            });
            const data = await response.json();
            const { output, options } = data;

            if (output.toLowerCase() === 'no question') {
                performSearch(query);
            } else {
                setClarification(output);
                setOptions(options);
                setIsAwaitingClarification(true);
            }
        } catch (err) {
            setError("An error occurred during disambiguation.");
            handleRedo()
            setDisableRetry(true)
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle submission of clarification
    const handleSubmitClarification = async (answer) => {
        setIsAwaitingClarification(false);
        if (!answer.trim()) {
            setError("Please provide an answer to the clarification question.");
            handleRedo()
            setDisableRetry(true)
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(MODIFYQUERY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AccessToken}`
                },
                body: JSON.stringify({
                    query,
                    question: clarification,
                    answer: answer,
                }),
            });
            const data = await response.json();
            const { output } = data;

            if (output.toLowerCase() === 'no question') {
                setError("Failed to modify the query based on the clarification.");
                handleRedo();
                setDisableRetry(true)
                return;
            }

            setFactDisplay(output);
            performSearch(output);
            setClarification(null);
            setClarificationAnswer('');
        } catch (err) {
            setError("An error occurred while modifying the query.");
            handleRedo();
            setDisableRetry(true)
            console.error(err);
        }
    };

    // Effect to trigger disambiguation or search when query changes
    useEffect(() => {
        if (!process) {
            return
        }
        if (query && lastSearchedQueryRef.current !== query) {
            lastSearchedQueryRef.current = query;
            // Reset previous state
            setResult(null);
            setSteps([]);
            setError(null);
            setClarification(null);
            setClarificationAnswer('');
            setIsAwaitingClarification(false);
            setFactDisplay(query);
            setCurrentPage(1);
            if (idHistory[id]) {
                performSearch(query);
            } else {
                // Start the disambiguation or search process
                if (skipDisambiguation) {
                    performSearch(query);
                } else {
                    handleDisambiguate();
                }
            }

        }
    }, [query, skipDisambiguation, process]);

    // useEffect(() => {
    //     console.log(sortedSteps)
    // }, [sortedSteps])

    const parseAndSortSteps = (steps) => {
        if (!Array.isArray(steps)) return [];

        const relevanceOrder = { high: 1, medium: 2, low: 3 };

        return steps
            .map(step => {
                try {
                    return JSON.parse(step);
                } catch (e) {
                    return step;
                }
            })
            .filter(step => step !== null)
            .sort((a, b) => relevanceOrder[a.relevance] - relevanceOrder[b.relevance]);
    };

    useEffect(() => {
        console.log("hit")
        const sorted = parseAndSortSteps(steps);
        if (sorted.length > 0) {
            setSortedSteps(sorted);
        } else {
            setSortedSteps([]);
        }

        // Optionally handle result.Classification here

    }, [steps, result]);



    const convertToSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };


    // Function to handle expansion toggle
    const handleExpandClick = () => {
        setExpanded((prev) => !prev);
    };


    // const match = factDisplay.match(/^timestamp-([\d:]+)\s(.*)$/);
    // const timestamp = match ? match[1] : '';
    // const factText = match ? match[2] : factDisplay;

    
    const match = factDisplay?.match(/^timestamp-([\d:]+)\s(.*)$/);
    const timestamp = match ? match[1] : '';
    const factText = match ? match[2] : factDisplay || '';
    

    // Add the rewardBonusPoint function

    // Example usage:
    // rewardBonusPoint(3, "feedback") - Rewards 3 points for feedback
    // rewardBonusPoint(6, "share") - Rewards 6 points for sharing
    
    return (
        <Paper
            elevation={0}
            style={{
                padding: '5px',
                width: '80vw',
                maxWidth: maxWidth,
                margin: '0px auto',
                overflowY: 'auto',
                backgroundColor: 'transparent',
                color: '#333',
                textAlign: 'left',
            }}
        >
                  {/* <WalkthroughFactCheck /> */}

            <div>
                {/* Display Query and Classification with Expand/Collapse Button if expandable */}
                    <div
                    style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row', // stack items vertically on mobile
                        alignItems: isMobile ? 'flex-start' : 'center',
                        justifyContent: 'space-between',
                    }}
                    >
                    <Typography style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* {factDisplay} */}
                        {timestamp && <div
                                    style={{
                                        marginRight: '10px',
                                        marginBottom: isMobile ? '8px' : '0', // add spacing below on mobile
                                      }}
                        ><Chip label={timestamp} size="small" onClick={() => setSeekTofunc(convertToSeconds(timestamp))}/><br/></div>}
                        {factText}
                        {error && !disableRetry ? (
                            <Button
                                onClick={handleRedo} // Add your retry logic here
                                variant="outlined"
                                color="error"
                                style={{
                                    marginLeft: '10px',
                                    borderRadius: '16px',
                                    padding: '4px 12px', // Adjust padding for button size
                                    fontSize: '12px', // Match size with the Chip
                                    height: '32px', // Ensure button matches Chip's height
                                }}
                            >
                                Retry
                            </Button>
                        ) : result ? (
                            <>
                            {console.log({result})}
                            <Chip
                                className = 'facti-tut-step-7'
                                label={result.Classification}
                                color={
                                    result.Classification === 'True'
                                        ? 'success'
                                        : result.Classification === 'False'
                                            ? 'error'
                                            : 'warning'
                                }
                                
                                style={{
                                    marginLeft: '10px',
                                    padding: '0 8px', // Reduce horizontal padding
                                    fontSize: '12px', // Smaller font size
                                    lineHeight: '1.4', // Adjust line height for tighter vertical spacing
                                    height: '24px', // Ensure the height matches the new text spacing
                                    backgroundColor:
                                        result.Classification === 'True'
                                            ? '#34C759'
                                            : result.Classification === 'False'
                                                ? '#FF3B30'
                                                : '#FF9500',
                                    color: 'white',
                                    textTransform: 'uppercase', // Capitalize the label text
                                    display: 'flex',
                                    alignItems: 'center', // Center text vertically
                                }}
                                size="small" // Use size="small" if supported by your Chip component library
                            />    
                            </>
                        ) : (
                            <Skeleton
                                variant="rectangular"
                                width={80} // Adjust to match the expected width of the Chip
                                height={32} // Adjust to match the expected height of the Chip
                                style={{ marginLeft: '10px', borderRadius: '16px' }} // Rounded corners to mimic Chip
                            />
                        )}
                    </Typography>
                    

                    {expandable && (
                        <IconButton onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more" >
                            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    )}

                    {/* <Divider /> */}
                </div>

                <Divider/>
                {currentStep && (
                    <Typography style={{ fontSize: '0.8rem', color: 'grey'}}>
                        {currentStep}
                    </Typography>
                )}

                {/* Conditionally render the expandable content */}
                {expandable ? (
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                                            <>
                        {/* Clarification Section */}
                        {isAwaitingClarification && clarification && (
                            <ClarificationSection
                                clarification={clarification}
                                options={options}
                                clarificationAnswer={clarificationAnswer}
                                onAnswerChange={(e) => setClarificationAnswer(e.target.value)}
                                onSubmit={handleSubmitClarification}
                                onSkip={() => {
                                    setIsAwaitingClarification(false);
                                    performSearch(query);
                                    setClarification(null);
                                    setClarificationAnswer('');
                                }}
                            />
                        )}

                        {/* Loading Indicator or Result Display */}
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                                <Skeleton variant="text" width="90%" style={{ marginBottom: '5px' }} />
                                <Skeleton variant="rectangular" animation="wave" width="100%" height={100} />
                            </div>
                        ) : result ? (
                            <>
                            {console.log({result})}
                            <Grow in={Boolean(result)} >
                                <div style={{ fontFamily: 'Arial' }} >
                                        <div style={{ marginTop: '10px', textAlign: 'left' }}>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: marked(
                                                        tags?.truncateExplanation
                                                            ? truncateWithMessage(result?.overall_assessment)
                                                            : result?.overall_assessment || ''
                                                    )
                                                }}
                                                style={{
                                                    marginTop: '5px',
                                                    lineHeight: '1.5',
                                                    textAlign: 'left',
                                                    fontFamily: 'Arial'
                                                }}
                                            />
                                        </div>

                                        {tags?.truncateExplanation && tags?.message && tags?.button && (
                                            tags.button === 'login' ? (
                                                <span
                                                    onClick={handleLogin}
                                                    style={{
                                                        marginTop: '10px',
                                                        display: 'inline-block',
                                                        cursor: 'pointer',
                                                        fontFamily: 'Arial',
                                                        fontSize: '18px',
                                                        color: '#007bff', // Optional: blue text to indicate it's clickable
                                                        textDecoration: 'underline' // Optional: underlined text
                                                    }}
                                                >
                                                    {tags.message}
                                                </span>
                                            ) : tags.button === 'subscription' ? (
                                                <a
                                                    href="/subscription"
                                                    style={{
                                                        marginTop: '10px',
                                                        display: 'inline-block',
                                                        cursor: 'pointer',
                                                        fontFamily: 'Arial',
                                                        fontSize: '18px',
                                                        color: '#007bff',
                                                        textDecoration: 'underline'
                                                    }}
                                                >
                                                    {tags.message}
                                                </a>
                                            ) : null
                                        )}

                                        {result.disambiguation && (
                                            <Grid container spacing={2} alignItems="center" sx={{ mt: 1, mb: 1 }}>
                                                <Grid item>
                                                    <Chip
                                                        label={
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                Disambiguation
                                                                {tags.hideDisambiguation ? (
                                                                    <LockIcon style={{ marginLeft: '5px' }} />
                                                                ) : disambisOpen ? (
                                                                    <ArrowDropUpIcon style={{ marginLeft: '5px' }} />
                                                                ) : (
                                                                    <ArrowDropDownIcon style={{ marginLeft: '5px' }} />
                                                                )}
                                                            </div>
                                                        }
                                                        onClick={tags.hideDisambiguation ? undefined : toggleDisambSection}
                                                        style={{
                                                            cursor: tags.hideDisambiguation ? 'default' : 'pointer',
                                                            opacity: tags.hideDisambiguation ? 0.6 : 1,
                                                        }}
                                                    />
                                                </Grid>
                                                
                                                {result.bias && Array.isArray(result.bias) && result.bias.length > 1 && (
                                                    <Grid item>
                                                        <Chip
                                                            label={
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    Bias
                                                                    {tags.hideBias ? (
                                                                        <LockIcon style={{ marginLeft: '5px' }} />
                                                                    ) : biasisOpen ? (
                                                                        <ArrowDropUpIcon style={{ marginLeft: '5px' }} />
                                                                    ) : (
                                                                        <ArrowDropDownIcon style={{ marginLeft: '5px' }} />
                                                                    )}
                                                                </div>
                                                            }
                                                            onClick={tags.hideBias ? undefined : toggleBiasSection}
                                                            style={{
                                                                cursor: tags.hideBias ? 'default' : 'pointer',
                                                                opacity: tags.hideBias ? 0.6 : 1,
                                                            }}
                                                        />
                                                    </Grid>
                                                )}
                                                
                                                {/* Only show TaskActions when tags.blur is false */}
                                                {!tags.blur && (
                                                    <Grid item xs sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                        <div ref={interactionBarRef}>
                                                            <TaskActions conversation_id={currentConversation} task_id={taskId} userEmail={email}/>
                                                        </div>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        )}

                                        {disambisOpen && (
                                        <div>
                                            {result.disambiguation && (
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: marked(result?.disambiguation) }}
                                                    style={{ marginTop: '5px', lineHeight: '1.5', textAlign: 'left', fontFamily: 'Arial' }}
                                                />
                                                // <Typography>
                                                //     Let's disambiguate: {result.disambiguation}
                                                // </Typography>
                                            )}
                                        </div>
                                        )}


                                        {biasisOpen && (
                                        <div>
                                            {result.bias && Array.isArray(result.bias) && result.bias.length > 1 && (
                                                <div>
                                                    {/* {console.log("plotting")} */}
                                                    <Grid container spacing={2}>
                                                    <Grid item xs={12} md={5}>
                                                        <div>
                            
                                                            <ScatterPlot claim={query} data={result.bias}/>
                                                        </div>
                                                    </Grid>
                                                    </Grid>
                                                </div>
                                            )}
                                        </div>
                                        )}

                                </div>
                            </Grow>
                            </>

                        ) : null}

                        {/* Source Summaries */}
                        {result?.timestamp && (
                            <div style={{ marginTop: '20px' }}>
                                <Typography variant="body2" color="textSecondary" textAlign="left">
                                    Fact-checked on: {new Date(result.timestamp).toLocaleDateString()}
                                </Typography>
                            </div>
                        )}
                        {sortedSteps.length > 0 ? (
                            <div style={{ marginTop: '20px' }} className='facti-tut-step-9'>
                                <Typography fontWeight="bold" textAlign="left"className = 'facti-tut-step-9'>
                                    {`Source Summaries: (${sortedSteps.length} sources)`}
                                </Typography>
                                <div style={{ marginTop: '3px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    {currentItems.map((step, index) => (
                                        <SourceCard key={index} step={step} index={index} tags={tags} userEmail={email} blurred = {tags.limitSource} />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <PaginationControls
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPrevious={handlePreviousPage}
                                        onNext={handleNextPage}
                                    />
                                )}
                            </div>
                        ) : (
                            loading && !isAwaitingClarification && (
                                <div style={{ marginTop: '20px' }} className='facti-tut-step-9'>
                                    <Typography variant="subtitle1" fontWeight="bold" textAlign="left" className = 'facti-tut-step-9'>
                                        Source Summaries:
                                    </Typography>
                                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {[1, 2, 3, 4, 5].map((index) => (
                                            <Card variant="outlined" key={index}>
                                                <CardContent>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Skeleton variant="circular" width={16} height={16} style={{ marginRight: '6px' }} />
                                                        <Skeleton variant="text" width={100} />
                                                    </div>
                                                    <Skeleton variant="text" width="90%" style={{ marginTop: '5px' }} />
                                                    <Skeleton variant="text" width="80%" />
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}

                        {/* Error Message */}
                        {error && !disableRetry && (
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                            <Typography variant="body1" color="error" style={{ textAlign: 'left' }}>
                            {error}
                            </Typography>
                            <Button
                            variant="outlined"
                            color="primary"
                            style={{ marginLeft: '10px', padding: '4px 8px' }}
                            onClick={handleRedo}
                            startIcon={<ReplayIcon />}
                            >
                            Retry
                            </Button>
                        </div>
                        )}
                    </>
                    </Collapse>
                ) : (
                    // Render all content as is without collapse
                    <>
                        {/* Clarification Section */}
                        {isAwaitingClarification && clarification && (
                            <ClarificationSection
                                clarification={clarification}
                                options={options}
                                clarificationAnswer={clarificationAnswer}
                                onAnswerChange={(e) => setClarificationAnswer(e.target.value)}
                                onSubmit={handleSubmitClarification}
                                onSkip={() => {
                                    setIsAwaitingClarification(false);
                                    performSearch(query);
                                    setClarification(null);
                                    setClarificationAnswer('');
                                }}
                            />
                        )}

                        {/* Loading Indicator or Result Display */}
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                                <Skeleton variant="text" width="90%" style={{ marginBottom: '5px' }} />
                                <Skeleton variant="rectangular" animation="wave" width="100%" height={100} />
                            </div>
                        ) : result ? (
                            <>
                            {console.log({result})}
                            <Grow in={Boolean(result)}>
                                <div style={{ fontFamily: 'Arial' }} className='facti-tut-step-8'>
                                        <div style={{ marginTop: '10px', textAlign: 'left' }}>
                                            <div
                                                ref={overallAssessmentRef}
                                                dangerouslySetInnerHTML={{
                                                    __html: marked(
                                                        tags?.truncateExplanation
                                                            ? truncateWithMessage(result?.overall_assessment)
                                                            : result?.overall_assessment || ''
                                                    )
                                                }}
                                                style={{
                                                    marginTop: '5px',
                                                    lineHeight: '1.5',
                                                    textAlign: 'left',
                                                    fontFamily: 'Arial'
                                                }}
                                            />

                                            {tags?.truncateExplanation && tags?.message && tags?.button && (
                                                tags.button === 'login' ? (
                                                    <span
                                                        onClick={handleLogin}
                                                        style={{
                                                            marginTop: '10px',
                                                            display: 'inline-block',
                                                            cursor: 'pointer',
                                                            fontFamily: 'Arial',
                                                            fontSize: '14px',
                                                            color: '#007bff', // Optional: blue text to indicate it's clickable
                                                            textDecoration: 'underline' // Optional: underlined text
                                                        }}
                                                    >
                                                        {tags.message}
                                                    </span>
                                                ) : tags.button === 'subscription' ? (
                                                    <a
                                                        href="/subscription"
                                                        style={{
                                                            marginTop: '10px',
                                                            display: 'inline-block',
                                                            cursor: 'pointer',
                                                            fontFamily: 'Arial',
                                                            fontSize: '14px',
                                                            color: '#007bff',
                                                            textDecoration: 'underline'
                                                        }}
                                                    >
                                                        {tags.message}
                                                    </a>
                                                ) : null
                                            )}

                                                                                        
                                        </div>


                                        {result.disambiguation && (
                                            <Grid container spacing={2} alignItems="center" sx={{ mt: 1, mb: 1 }}>
                                                <Grid item>
                                                    <Chip
                                                        label={
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                Disambiguation
                                                                {tags.hideDisambiguation ? (
                                                                    <LockIcon style={{ marginLeft: '5px' }} />
                                                                ) : disambisOpen ? (
                                                                    <ArrowDropUpIcon style={{ marginLeft: '5px' }} />
                                                                ) : (
                                                                    <ArrowDropDownIcon style={{ marginLeft: '5px' }} />
                                                                )}
                                                            </div>
                                                        }
                                                        onClick={tags.hideDisambiguation ? undefined : toggleDisambSection}
                                                        style={{
                                                            cursor: tags.hideDisambiguation ? 'default' : 'pointer',
                                                            opacity: tags.hideDisambiguation ? 0.6 : 1,
                                                        }}
                                                    />
                                                </Grid>
                                                
                                                {result.bias && Array.isArray(result.bias) && result.bias.length > 1 && (
                                                    <Grid item>
                                                        <Chip
                                                            label={
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    Bias
                                                                    {tags.hideBias ? (
                                                                        <LockIcon style={{ marginLeft: '5px' }} />
                                                                    ) : biasisOpen ? (
                                                                        <ArrowDropUpIcon style={{ marginLeft: '5px' }} />
                                                                    ) : (
                                                                        <ArrowDropDownIcon style={{ marginLeft: '5px' }} />
                                                                    )}
                                                                </div>
                                                            }
                                                            onClick={tags.hideBias ? undefined : toggleBiasSection}
                                                            style={{
                                                                cursor: tags.hideBias ? 'default' : 'pointer',
                                                                opacity: tags.hideBias ? 0.6 : 1,
                                                            }}
                                                        />
                                                    </Grid>
                                                )}
                                                
                                                {/* Only show TaskActions when tags.blur is false */}
                                                {!tags.blur && (
                                                    <Grid item xs sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                        <div ref={interactionBarRef}>
                                                            <TaskActions conversation_id={currentConversation} task_id={taskId} userEmail={email}/>
                                                        </div>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        )}

                                        {disambisOpen && (
                                        <div>
                                            {result.disambiguation && (
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: marked(result?.disambiguation) }}
                                                    style={{ marginTop: '5px', lineHeight: '1.5', textAlign: 'left', fontFamily: 'Arial' }}
                                                />
                                                // <Typography>
                                                //     Let's disambiguate: {result.disambiguation}
                                                // </Typography>
                                            )}
                                        </div>
                                        )}


                                        {biasisOpen && (
                                        <div>
                                            {result.bias && Array.isArray(result.bias) && result.bias.length > 1 && (
                                                <div>
                                                    {/* {console.log("plotting")} */}
                                                    <Grid container spacing={2}>
                                                    <Grid item xs={12} md={5}>
                                                        <div>
                            
                                                            <ScatterPlot claim={query} data={result.bias}/>
                                                        </div>
                                                    </Grid>
                                                    </Grid>
                                                </div>
                                            )}
                                        </div>
                                        )}

                                </div>
                            </Grow>
                            
                            </>
                        ) : null}

                        {/* Source Summaries */}
                        {result?.timestamp && (
                            <div style={{ marginTop: '20px' }}>
                                <Typography variant="body2" color="textSecondary" textAlign="left">
                                    Fact-checked on: {new Date(result.timestamp).toLocaleDateString()}
                                </Typography>
                            </div>
                        )}
                        {sortedSteps.length > 0 ? (
                            <div style={{ marginTop: '20px' }} className='facti-tut-step-9'>
                                <Typography fontWeight="bold" textAlign="left" className='facti-tut-step-9'>
                                    {`Source Summaries: (${sortedSteps.length} sources)`}
                                </Typography>
                                <div style={{ marginTop: '3px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    {currentItems.map((step, index) => (
                                        <SourceCard key={index} step={step} index={index} tags={tags} userEmail={email} blurred = {tags.limitSource} />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <PaginationControls
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPrevious={handlePreviousPage}
                                        onNext={handleNextPage}
                                    />
                                )}
                            </div>
                        ) : (
                            loading && !isAwaitingClarification && (
                                <div style={{ marginTop: '20px' }}>
                                    <Typography variant="subtitle1" fontWeight="bold" textAlign="left" className='facti-tut-step-9'>
                                        Source Summaries:
                                    </Typography>
                                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {[1, 2, 3, 4, 5].map((index) => (
                                            <Card variant="outlined" key={index}>
                                                <CardContent>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Skeleton variant="circular" width={16} height={16} style={{ marginRight: '6px' }} />
                                                        <Skeleton variant="text" width={100} />
                                                    </div>
                                                    <Skeleton variant="text" width="90%" style={{ marginTop: '5px' }} />
                                                    <Skeleton variant="text" width="80%" />
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}

                        {/* Error Message */}
                        {error && (
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                <Typography variant="body1" color="error" style={{ textAlign: 'left' }}>
                                    {error}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    style={{ marginLeft: '10px', padding: '4px 8px' }}
                                    onClick={handleRedo}
                                    startIcon={<ReplayIcon />}
                                >
                                    Retry
                                </Button>
                            </div>
                        )}

                    </>
                )}
            </div>
            
            {/* Add the reward popup component */}
            <RewardPopup 
                open={showRewardPopupDialog} 
                onClose={() => setShowRewardPopupDialog(false)}
                taskId={taskId}
                userEmail={email}
                backendUrl={backendUrl}
                interactionBarRef={interactionBarRef}
                onPermanentDisable={handlePermanentDisable}
                scrollToInteractionBar={scrollToInteractionBar}
            />
            
            {/* Add a data attribute for TaskActions to find */}
            <div data-task-id={taskId} style={{ display: 'none' }}></div>
        </Paper>
    );
};

export default FactCheckDisplay;