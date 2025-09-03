// src/context/AppContext.js
import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import useAuth from '../../useAuthHook';
import { useAppContext } from '../../AppProvider';
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // State variables
  const [claim, setClaim] = useState('');
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dict, setDict] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [facts, setFacts] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [claimsProcessing, setClaimsProcessing] = useState([]);
  const [extractedClaims, setExtractedClaims] = useState([]);
  const [projects, setProjects] = useState([]);
  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null);
  const [filesObj, setFilesObj] = useState([]);
  const [currentProject, setCurrentProject] = useState('');
  const [files, setFiles] = useState([]);
  const [chatResponse, setChatResponse] = useState('');
  const [conversation, setConversation] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState('');
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [referenceArray, setReferenceArray] = useState([]);
  const [checkEnabled, setCheckEnabled] = useState(true)
  const [fontSize, setFontSize] = useState("14px")
  const [tabNum, setTabNum] = useState({True:0,False:0,Unverifiable:0,"View All":0})
  const [claimsRemaining,setClaimsRemaining] = useState(0)
  const claimsRef = useRef(claimsRemaining);
  const [isFactChecking, setIsFactChecking] = useState(false);
  const [filter, setFilter] = useState({ search: ["web","journals"] });
  const [ text, setText ] = useState("")
  const [highlightColor, setHighlightColor] = useState('#ffffff'); // White background

  const {backendUrl} = useAppContext()
  const editorRef = useRef(null);
  // Keep the ref in sync whenever claimsRemaining updates
  useEffect(() => {
    claimsRef.current = claimsRemaining;
  }, [claimsRemaining]);


  // Handle executing commands
  const handleCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    // After executing a command, refocus the editor
    editorRef.current?.focus();
  };

  

  const focusEditor = () => {
    editorRef.current?.focus();
  };


  const [url, setUrl] = useState(backendUrl)
  // const [url, setUrl] = useState("https://dd50-219-74-237-73.ngrok-free.app")

  useEffect(() => {
    console.log("Claims remaining:", claimsRemaining);
  }, [claimsRemaining]); // Dependency array ensures this runs when claimsRemaining changes

  useEffect(() => {
    console.log("Claims remaining:", claimsRemaining);
  }, [facts]); // Dependency array ensures this runs when claimsRemaining changes

  useEffect(() => {
    // Check if facts is a valid array
    if (!Array.isArray(facts)) {
      setTabNum({
        True: 0,
        False: 0,
        Unverifiable: 0,
        "View All": 0,
      });
      return;
    }

    // Initialize counts
    const counts = {
      True: 0,
      False: 0,
      Unverifiable: 0,
    };

    // Iterate through facts and count classifications
    facts.forEach((fact) => {
      const classification = fact.Classification;
      console.log({fact})
      const done = fact.done
      if ((classification in counts && done !== true)){
        counts[classification] += 1;
      }
    });

    // Calculate "View All" as the sum of all counts
    const total = Object.values(counts).reduce((acc, curr) => acc + curr, 0);

    // Update the state with new counts
    setTabNum({
      ...counts,
      "View All": total,
    });
  }, [facts]); // Re-run effect whenever 'facts' changes


  const [localurl, setLocalUrl] = useState("http://localhost:5000")

  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth();

  return (
    <AppContext.Provider
      value={{
        claim, setClaim,
        output, setOutput,
        loading, setLoading,
        dict, setDict,
        tabValue, setTabValue,
        facts, setFacts,
        history, setHistory,
        searchQuery, setSearchQuery,
        claimsProcessing, setClaimsProcessing,
        extractedClaims, setExtractedClaims,
        projects, setProjects,
        username: isAuthenticated ? user?.email || username : username, // Update based on Auth0 user
        setUsername,
        error, setError,
        filesObj, setFilesObj,
        currentProject, setCurrentProject,
        files, setFiles,
        chatResponse, setChatResponse,
        conversation, setConversation,
        selectedClaim, setSelectedClaim,
        totalProcessed, setTotalProcessed,
        referenceArray, setReferenceArray,
        checkEnabled, setCheckEnabled,
        fontSize, setFontSize,
        filter, setFilter,
        tabNum, setTabNum,
        highlightColor, setHighlightColor,
        isAuthenticated,
        loginWithRedirect, // Function to trigger login
        logout, // Function to trigger logout
        email: isAuthenticated ? user?.email || user.email : "",
        url,localurl,
        isFactChecking, setIsFactChecking,
        claimsRemaining,setClaimsRemaining,claimsRef,
        text, setText, editorRef, handleCommand, focusEditor
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppWrapper = ({ children }) => (
    <AppProvider>{children}</AppProvider>
);
