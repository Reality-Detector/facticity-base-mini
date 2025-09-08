"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import useAuth from './auth/useAuthHook.jsx';
import { usePostHog } from 'posthog-js/react';
import { handleAuth0Error, getTokenSafely, getTokenWithFallback } from './auth/authUtils.jsx';

const backendUrl = '/api';

// Create a Context for the Disambiguation
const AppContext = createContext();


// Create a Provider component
export const AppProvider = ({ children }) => {
  const { user, getAccessTokenSilently, isAuthenticated, isLoading, logout } = useAuth();

  const [skipDisambiguation, setSkipDisambiguation] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedValue = localStorage.getItem('skipDisambiguation');
        return storedValue !== null ? JSON.parse(storedValue) : true;
      }
      return true;
    } catch (error) {
      console.error('Error reading skipDisambiguation from localStorage:', error);
      return true;
    }
  });

  // State to control whether to show reward popup
  const [showRewardPopup, setShowRewardPopup] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        // First check if user has permanently disabled the popup
        const permanentlyDisabled = localStorage.getItem('permanentlyDisableRewardPopup');
        if (permanentlyDisabled === 'true') {
          return false;
        }
        
        // Otherwise use the regular toggle state
        const storedValue = localStorage.getItem('showRewardPopup');
        return storedValue !== null ? JSON.parse(storedValue) : true;
      }
      return true;
    } catch (error) {
      console.error('Error reading reward popup settings from localStorage:', error);
      return true;
    }
  });

  // Save showRewardPopup state to localStorage with user decision persistence
  useEffect(() => {
    localStorage.setItem('showRewardPopup', JSON.stringify(showRewardPopup));
    
    // If user has explicitly set this to false (via Don't Show Again), 
    // we want to record that as a permanent choice
    if (showRewardPopup === false) {
      try {
        localStorage.setItem('permanentlyDisableRewardPopup', 'true');
      } catch (error) {
        console.error('Error saving permanent popup preference:', error);
      }
    }
  }, [showRewardPopup]);

  useEffect(() => {
      localStorage.setItem('skipDisambiguation', JSON.stringify(skipDisambiguation));
  }, [skipDisambiguation]);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem('skipDisambiguation');
      if (storedValue !== null) {
        setSkipDisambiguation(JSON.parse(storedValue));
      }
    } catch (error) {
      // console.error('Failed to retrieve skipDisambiguation from localStorage:', error);
      // Optionally, you can reset to default if parsing fails
      setSkipDisambiguation(false);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // Function to toggle showRewardPopup state
  const toggleShowRewardPopup = () => {
    setShowRewardPopup(prev => !prev);
  };

  // Function to reset the permanent disable preference
  const resetRewardPopupPreference = () => {
    try {
      localStorage.removeItem('permanentlyDisableRewardPopup');
      setShowRewardPopup(true);
    } catch (error) {
      console.error('Error resetting reward popup preference:', error);
    }
  };

  const [version, setVersion] = useState("pro")
  const [isSearchMoved, setIsSearchMoved] = useState(false);
  const [mode, setMode] = useState("verify")
  const [errorDisplay, setErrorDisplay] = useState("")
  const [email, setEmail] = useState(null);

  const [overlayLogin, setOverlayLogin] = useState(false)
  const [seekto, setSeekto] = useState(0)
  
  const [ids, setIds] = useState([])
  const [currentConversation, setCurrentConversation] = useState("")
  const [queries, setQueries] = useState([])
  const [conversations, setConversations] = useState([])
  const [link, setLink] = useState("")
  const [NewSearch, setNewSearch] = useState(true)
  const [vismode, setVismode] = useState({})

  const [workspaceLoading, setWorkspaceLoading] = useState(false)
  const [hideSearchBar, setHideSearchBar] = useState(false)
  const [idHistory, setIdHistory] = useState({})
  const [progress, setProgress] = useState({})

  const [userLocCity, setUserLocCity] = useState("")
  const [userLocCtry, setUserLocCtry] = useState("")
  const [userLocReg, setUserLocReg] = useState("")
  const [headlines, setHeadlines] = useState([])
  const [sourceFindMode, setSourceFindMode] = useState(false)

  
  const [userCredits, setUserCredits] = useState(0)

  const [dailyTaskCredits, setDailyTaskCredits] = useState(0);
  const [CommunityCredits, setCommunityCredits] = useState(0);
  
  const [totalUserCredits, setTotalUserCredits] = useState(0)
  const [dailyUserCredits, setDailyUserCredits] = useState(0)
  const [totalTemporaryUserCredits, setTotalTemporaryUserCredits] = useState(0)
  const [temporaryUserCreditsList, setTemporaryUserCreditsList] = useState([])
  const [temporaryExpiries,setTemporaryExpiries] = useState([])

  const [creditsLoading, setCreditsLoading] = useState(true)
  const [claimsRecieved, setClaimsRecieved] = useState(false)
  const [hasSeenTut, setHasSeenTut] = useState(false)
  const [run, setRun] = useState(false);
  const [forceRun, setForceRun] = useState(false);
  const [distributedUrl, setDistributedUrl] = useState('');
  const [postClaims, setPostClaims] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  
  // Profile state
  const [profile, setProfile] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // User handle state
  const [userHandle, setUserHandle] = useState('');
  const [handleLoading, setHandleLoading] = useState(false);
  
  // Ref to track if subscription status has been fetched
  const subscriptionFetched = useRef(false);


  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const posthog = usePostHog();

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated && !subscriptionFetched.current) {
        const { token, needsReauth } = await getTokenWithFallback(
          getAccessTokenSilently, 
          logout, 
          'initial token fetch'
        );
        if (user){
          console.log({user})
        }
        if (token) {
          console.log("Token:", token);
          setAccessToken(token);
          // Load subscription status, profile, and user handle once when token is available
          subscriptionFetched.current = true;
          await fetchSubscriptionStatus(token);
          await fetchProfile(token);
          await fetchUserHandle(token);
        } else if (needsReauth) {
          console.log("User needs to re-authenticate. Token fetch failed.");
          // The logout will be handled automatically by getTokenWithFallback
        }
      }
    };
    getToken();
  }, [isAuthenticated, logout]);

  
  useEffect(() => {
    console.log("Queries changed:", queries);
    setPostClaims(queries);
  }, [queries]);

  
  // Fetch distributed URL from API
  useEffect(() => {
    const fetchDistributedUrl = async () => {
      try {
        // console.log('Fetching distributed URL from Lambda...');
        // const response = await fetch('https://j3odd112xc.execute-api.us-west-2.amazonaws.com/requestDistributor', {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });
        
        // if (response.ok) {
        //   const data = await response.json();
        //   console.log('Lambda response:', data);
          
        //   // Data is already in the correct format: { "backend_url": "https://..." }
        //   if (data.backend_url) {
        //     console.log('Setting distributed URL to:', data.backend_url);
        //     setDistributedUrl(data.backend_url);
        //     console.log("distributed url app provider", data.backend_url)
        //   } else {
        //     console.warn('No backend_url found in response, using fallback');
        //     setDistributedUrl('https://rdjinpnweu.us-west-2.awsapprunner.com');
        //   }
        // } else {
        //   console.warn('Failed to fetch distributed URL, status:', response.status);
        //   setDistributedUrl('https://rdjinpnweu.us-west-2.awsapprunner.com');
        // }
        
        // setDistributedUrl('http://localhost:5052')
        // setDistributedUrl('https://ivvwnxhduu.us-west-2.awsapprunner.com')
        setDistributedUrl(backendUrl)
        // setDistributedUrl('https://r8wncu74i2.us-west-2.awsapprunner.com')
      } catch (error) {
        console.error('Error fetching distributed URL:', error);
        // Set fallback URL on error
        // setDistributedUrl('http://localhost:5052');
        // setDistributedUrl('https://ivvwnxhduu.us-west-2.awsapprunner.com');
        setDistributedUrl(backendUrl)
        // setDistributedUrl('https://r8wncu74i2.us-west-2.awsapprunner.com')
      }
    };

    fetchDistributedUrl();
  }, []); // Run once on component mount

  // Log distributedUrl whenever it changes
  useEffect(() => {
    console.log("Distributed URL updated:", distributedUrl);
  }, [distributedUrl]);

  // Add new state for distributed URL
   // Default fallback URL

  // const backendUrl = 'http://localhost:5000';
  // const backendUrl = 'http://localhost:5052';
  // const backendUrl = 'https://ecsbackend.facticity.ai';
  
  
  const claimExtractUrl = backendUrl; // Use same URL for consistency


  
  // const backendUrl = 'https://rdjinpnweu.us-west-2.awsapprunner.com'
  
  // const backendUrl = 'https://backend.facticity.ai';
  const [searchQuery, setSearchQuery] = useState("");

  const [isProUser, setIsProUser] = useState("basic"); // basic subscription tier as default
  
  const [seektrigger, setSeekTrigger] = useState(true)
  const [highlightSearch, setHighlightSearch] = useState(false); // New state

  // Add state for discover posts
  const [discoverPosts, setDiscoverPosts] = useState([]);
  
  // Fetch discover posts
  // useEffect(() => {
  //   const fetchDiscoverPosts = async () => {
  //     try {
  //       // Updated to use the same API endpoint as Discover.js with appropriate params
  //       const userParam = (isAuthenticated && user?.email) ? `&user_email=${encodeURIComponent(user.email)}` : '';
  //       const headers = {
  //         'Content-Type': 'application/json',
  //         'Validator': 'privy'
  //       };
        
  //       if (accessToken) {
  //         headers['Authorization'] = `Bearer ${accessToken}`;
  //         headers['Validator'] = 'privy';
  //       }
        
  //       const response = await fetch(
  //         `${backendUrl}/api/published-posts?skip=0&limit=5&sort_by=recent${userParam}&tab=feed`,
  //         {
  //           method: 'GET',
  //           headers: headers,
  //         }
  //       );
        
  //       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  //       const data = await response.json();
  //       setDiscoverPosts(data || []);
  //     } catch (error) {
  //       console.error("Error fetching discover posts:", error);
  //     }
  //   };
    
  //   fetchDiscoverPosts();
    
  //   // Set up a refresh interval for discover posts (every 5 minutes)
  //   const intervalId = setInterval(fetchDiscoverPosts, 5 * 60 * 1000);
    
  //   return () => clearInterval(intervalId);
  // }, [backendUrl, isAuthenticated, user?.email, accessToken]);

  


  useEffect(() => {
    if (isAuthenticated) {
      setEmail(user?.email || user?.id);
      setOverlayLogin(false);
    } else {
      setEmail("");
      // Reset subscription fetch flag, profile, and user handle state when user logs out
      subscriptionFetched.current = false;
      setProfile({});
      setProfileLoaded(false);
      setProfileLoading(false);
      setUserHandle('');
      setHandleLoading(false);
    }
  }, [isAuthenticated, user]);

  // Fetch profile data
  const fetchProfile = async (token = accessToken) => {
    if (user && !profileLoaded) {
      setProfileLoading(true);
      const url = backendUrl + `/get-user-web3?wallet_id=${user.wallet.address}`;
      try {
        const headers = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          headers['Validator'] = 'privy';
        }
        const response = await fetch(url, {
          method: 'GET',
          headers: headers,
        });
        const data = await response.json();
        setProfile(data);
        setProfileLoaded(true);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setProfileLoading(false);
      }
    }
  };

  // Fetch user handle
  const fetchUserHandle = async (token = accessToken) => {
    console.log("fetching user handle")
    setHandleLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['Validator'] = 'privy';
      }
      
      const response = await fetch(`${backendUrl}/api/get_userhandle?email=${encodeURIComponent(user.email)}`, {
        method: 'GET',
        headers: headers,
      });
      if (!response.ok) throw new Error('Failed to fetch user handle');
      
      const data = await response.json();
      if (data.handle) {
        setUserHandle(data.handle);
      } else {
        // No handle exists, keep userHandle empty to show create option
        setUserHandle('');
      }
    } catch (error) {
      console.error('Error fetching user handle:', error);
      setUserHandle('');
    } finally {
      setHandleLoading(false);
    }
  };

  const fetchSubscriptionStatus = async (token = accessToken) => {
    console.log("fetching subscription status 2")
    setCreditsLoading(true)
    console.log({isAuthenticated, user})
    if (isAuthenticated && (user?.email || user?.sub)) {
      console.log("fetching subscription status 3")
      try {
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
        handleAuth0Error(error, 'subscription fetch');
      }

      try {
        //const backendUrl = "http://localhost:5000"
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          headers['Validator'] = 'privy';
        }
        
        const response = await fetch(`${backendUrl}/check_credits_util`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({userEmail: user.email, wallet_id: user.wallet.address})
        });

        if(response.ok)
        {
          const data = await response.json()
          if(data.user_credits){
            console.log(data.user_credits)
            setTotalUserCredits(data.user_credits)
            setUserCredits(data.user_credits)
          }

          if(data.daily_credits){
            console.log(data.daily_credits)
            setDailyUserCredits(data.daily_credits)
          }

          if(data.lifetime_credits){
            setDailyTaskCredits(data.lifetime_credits)
          }

          if (data.community_credits){
            setCommunityCredits(data.community_credits)
          }

          setCreditsLoading(false)
          
        }

      } catch (error) {
        console.error("Error fetching user credits: ", error)
      }
    }
    setCreditsLoading(false)
  };





  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
          headers['Validator'] = 'privy';
        }
        
        const response = await fetch(backendUrl+'/update_ids', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            email: email, // replace with actual email
            id: "" // empty id
          })
        });

        if (!response.ok) {
          // console.log("Network response was not ok");
        } else{
            const data = await response.json();
            setConversations(data.ids);
        }


        // setCurrentConversation(data.ids[0]); // Set the first conversation as the current one
      } catch (error) {
        // console.error("Error fetching conversations:", error);
      }
    };

    if (accessToken){
      fetchConversations();
    }
  }, [email, accessToken]);

  useEffect(() => {
   
    const getHasSeenTutFlag = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
          headers['Validator'] = 'privy';
        }
        
        const response = await fetch(backendUrl + '/has-seen-tut', {
          method: 'POST', 
          headers: headers,
          body : JSON.stringify({
            userEmail : user?.email || null
          })
        });

        if(!response.ok){
          //
        }
        else {
          const data = await response.json();
            setHasSeenTut(data.hasSeenTut);
        }
      }
      catch {
        //
      }
    };
    if(isAuthenticated) {
    getHasSeenTutFlag();
    }
  }, [email, accessToken])

  const fetchTaskStatus = async (conversationId) => {
    // console.log("FETCHING", conversationId)
    let data = null
    try {
      setWorkspaceLoading(true);
      setIsSearchMoved(true);
      // const response = await fetch('https://backend-word-testing-934923488639.us-central1.run.app/check-multiple-task-status'
      const headers = {
        'Content-Type': 'application/json',
        'Validator' : 'privy',
        'Frontend' : 'web3'
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
        
      }
      
      const response = await fetch(backendUrl+'/check-multiple-task-status', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ _id: conversationId }), // assuming the conversationId matches the "_id" expected by the endpoint
      });
    
      // console.log({fetchStatus:response})

  
      data = await response.json();
      // console.log({ data });

      // if(data && data.taskScheduled){
      //   console.log(data.progress);
      //   setMode(data.vis_mode.mode);
      //   setLink(data.vis_mode.link);
      //   setProgress(data.progress);
      //   return;
      // }

      if (!response.ok) {
        setErrorDisplay("Session ended abruptly, no conversation found.")
        console.warn(`Backend responded with status: ${response.status}`);
        return; // Exit early if the response is not OK
      }

      if (!data.responses || data.responses.length === 0) {
        // console.log("No responses found");
        data.responses = [{}]
        // return; // Exit early if there are no responses
      }
      // setVismode(data.vis_mode)
      setClaimsRecieved(true)
      const mappedResponses = data.responses.reduce((acc, response) => {
        acc[response.task_id] = response;
        return acc;
      }, {});
  
      console.log({mappedResponses})
      setIdHistory(mappedResponses);
      setIds(Object.keys(mappedResponses));
      setQueries(Object.values(mappedResponses).map((response) => response.input));

      setMode(data.vis_mode.mode)
      setLink(data.vis_mode.link)
      setProgress(data.progress)


      window.history.replaceState(null, '', `/c/${conversationId}`);
    } catch (error) {
      console.warn('An error occurred while fetching task status:', error);
      // Log the error and silently handle it without updating state
    } finally {
      setWorkspaceLoading(false);
    }
  };
  

  useEffect(() => {
    // console.log({ NewSearch });
    if (!isAuthenticated && mode =="extractFacts"){
      setHideSearchBar(true)
    }
    // console.log(isAuthenticated,queries.length)
    if (!isAuthenticated && currentConversation){
      setHideSearchBar(true)
    }
    if (currentConversation !== undefined && currentConversation !== "" && !NewSearch) {
      // console.log("excecuted",NewSearch)
      fetchTaskStatus(currentConversation);
    }

  }, [currentConversation, conversations, NewSearch, vismode, mode]);

  const fetchUserLocation = async () => {
    try {
      const res = await fetch("https://ipinfo.io/json?token=5555ba99952ea6");
      const data = await res.json();
      console.log(data.country)
      console.log(data.city)
      return { country: data.country, city: data.city || data.region };
      
      //console.log(data) 
    } catch (error) {
      console.error("Error fetching loc info:", error);
      return null;
    }
  };
  
  const fetchCountryNews = async (country) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
        headers['Validator'] = 'privy';
      }
      
      // const res = await fetch(backendUrl + `/news/country?country=${country}`, {
      const res = await fetch(`/api/news/country?country=${country}`, {
        method: 'GET',
        headers: headers,
      });
      const data = await res.json();
  
      // Ensure you're returning an array of article objects
      const articles = data.headlines || [];
  
      console.log(articles); // This will be an array of article objects
      return articles;
    } catch (error) {
      console.error("Error fetching country news:", error);
      return [];
    }
  };
  

  // useEffect(() => {
  //   const loadHeadlines = async () => {
  //     const { country, city } = await fetchUserLocation();
  //     const countryNews = await fetchCountryNews(country)
  //     console.log(countryNews)
  //     setUserLocCtry(country);
  //     setUserLocCity(city);
  //     setHeadlines(countryNews);
  //   };
  //   loadHeadlines();
    
  // }, []);
  
  // Function to toggle skipDisambiguation state
  const toggleSkipDisambiguation = () => {
    setSkipDisambiguation(prev => !prev);
  };

  return (
    <AppContext.Provider value={{ 
        skipDisambiguation, 
        setSkipDisambiguation, 
        toggleSkipDisambiguation,
        showRewardPopup,
        setShowRewardPopup,
        toggleShowRewardPopup,
        resetRewardPopupPreference,
        version,
        setVersion,
        currentConversation,
        setCurrentConversation,
        queries,
        setQueries,
        ids,
        setIds,
        conversations,
        setConversations,
        idHistory, 
        setIdHistory,
        isSearchMoved, 
        setIsSearchMoved,
        workspaceLoading,
        mode,
        setMode,
        link, setLink, errorDisplay, setErrorDisplay, email, setNewSearch,
        overlayLogin, setOverlayLogin, hideSearchBar, setHideSearchBar, sourceFindMode, setSourceFindMode,
        isProUser, setIsProUser, seekto, setSeekto, setSeekTrigger, seektrigger, claimExtractUrl, backendUrl, userLocCity, userLocReg, userLocCtry, headlines,
        claimsRecieved, setClaimsRecieved,
        creditsLoading, setCreditsLoading,
        userCredits, setUserCredits,
        searchQuery, setSearchQuery,
        highlightSearch, setHighlightSearch, progress, setProgress,
        hasSeenTut,
        run, setRun,
        forceRun, setForceRun,
        totalUserCredits, setTotalUserCredits,
        dailyUserCredits, setDailyUserCredits,
        temporaryUserCreditsList, setTemporaryUserCreditsList,
        temporaryExpiries, setTemporaryExpiries,
        totalTemporaryUserCredits, setTotalTemporaryUserCredits,
        fetchSubscriptionStatus,
        discoverPosts, setDiscoverPosts,
        distributedUrl, setDistributedUrl,
        postClaims, setPostClaims, accessToken, 
        setAccessToken,
        profile, setProfile,
        profileLoading, setProfileLoading,
        profileLoaded, setProfileLoaded,
        fetchProfile,
        userHandle, setUserHandle,
        handleLoading, setHandleLoading,
        fetchUserHandle,
        dailyTaskCredits, setDailyTaskCredits,
        CommunityCredits, setCommunityCredits
        }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  return useContext(AppContext);
};
