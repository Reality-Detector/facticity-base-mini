import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import PropTypes from "prop-types";

// MUI Components
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Chip,
  TextField, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Alert, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Snackbar 
} from '@mui/material';

// MUI Icons
import ChatIcon from '@mui/icons-material/Chat';
import BookIcon from '@mui/icons-material/Book';
import SettingsIcon from '@mui/icons-material/Settings';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import {
  Search as SearchIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';

// Fluent UI Icons (optional; remove if not used)
import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";

// Local Components and Utilities
import Header from "./Header";
import HeroList from "./HeroList";
import ExpandComponentSimple from "./FactCard";
import ClaimsProcessingModule from "./claimsProcessing";
// import { useUtils } from "./utils";
import ProjectsSection from "./Projects";
import UploadToPinecone from "./Upload";
import ExpandableModule from "./Files";
import ChatInterface from "./queryComponents/ChatInterface";
import CorrectionOptions from "./CorrectionOptions";
import FactList from "./Factlist";
import { AppContext } from "./AppContext";
import Profile from "./Profile";
import Toast from "./Toast/Toast";
import * as APAUtility from './citations/APAutility';
import ReferenceList from './SourceComponents/references';
import { createAndCheckTask } from "./runasyncqueries";
import stringSimilarity from "string-similarity";
import debounce from 'lodash.debounce';
import { useAppContext } from '../../AppProvider';
import useAuth from '../../auth/useAuthHook';
//
// --------------- REFACTORED TASKPANE FOR WEB ---------------
//

const Taskpane = (props) => {
  // --------------------- State Management ----------------------
  const [activeTab, setActiveTab] = useState('factCheck');
  const { accessToken, backendUrl, setAccessToken, setUserCredits } = useAppContext();
  const { getAccessTokenSilently } = useAuth();
  // const { splitText, rewriteText } = useUtils();
  const { title } = props;

  // The text we display in the "web document"
  // You could load an initial string from your backend or keep it empty.
  const [editorHtml, setEditorHtml] = useState(`
    <p>
      This is a simple paragraph in a web-based editor.<br/>
      Select some text to "fact-check" or "rewrite".
    </p>
  `);

  // Track user’s selection (plain text) in the browser
  const [selectedText, setSelectedText] = useState("");

  // Show a “no selection” message
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // For toggling the side menu open/close (if you want)
  const [isOpen, setIsOpen] = useState(false);

  // For toast messages
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const {
    setLoading,
    dict, setDict,
    tabValue, setTabValue,
    facts, setFacts,
    history, setHistory,
    claimsProcessing, setClaimsProcessing,
    extractedClaims, setExtractedClaims,
    username,setError,
    filesObj,
    currentProject,
    files, setFiles,
    conversation, setConversation,
    selectedClaim, setSelectedClaim,
    totalProcessed, setTotalProcessed,
    referenceArray, setReferenceArray,
    checkEnabled, setCheckEnabled,
    fontSize, setFontSize,
    isAuthenticated, setTabNum,
    claimsRemaining,setClaimsRemaining,
    tabNum,
    claimsRef,
    setIsFactChecking,
    filter,url, text
  } = useContext(AppContext);
  
  const { editorRef, handleCommand, focusEditor, highlightColor, setHighlightColor} = useContext(AppContext);

  const splitText = async (text, accessToken) => {
    try {
        const data = { query: text };
        const response = await fetch('/api/split_sentence', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'Validator':'privy',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result.claims) {
            return result; // Return the claims array
        } else {
            console.error('No claims returned from the API.');
            return null;
        }
    } catch (error) {
        console.error('Error occurred while splitting sentence:', error);
        return null;
    }
};


// const handleCorrectionWithCitation = async (
//   inputText,
//   correctedText,
//   inTextCitation,
//   url,
//   references
// ) => {
//   if (!inputText || !inTextCitation || !url) {
//     // console.log("All arguments must be provided.");
//     setError("All arguments (inputText, correctedText, inTextCitation, url) must be provided.");
//     return;
//   }

//   const escapedInputText = inputText.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
//   const inputTextRegex = new RegExp(`(${escapedInputText})`, 'gi');

//   updateQueue = updateQueue.then(async () => {
//     // const editorContent = editorRef.current.innerHTML;
//     const editorContent = decodeHtmlEntities(editorRef.current.innerHTML)
//     const updatedContent = editorContent.replace(inputTextRegex, (match) => {
//       const correctedSpanWithCitation = `
//         <span style="background-color: #FFFFFF;">
//           ${correctedText}&nbsp;
//           <a href="${url}" 
//              title="${url}" 
//              target="_blank" 
//              style="text-decoration: underline; background-color: #FFFFFF; cursor: pointer;">
//             ${inTextCitation}
//           </a>
//         </span>`;
//       return correctedSpanWithCitation;
//     });

//     editorRef.current.innerHTML = updatedContent;
    
//     // console.log(`Replaced "${inputText}" with "${correctedText}" and added an in-text citation "${inTextCitation}" as an HTML hyperlink to "${url}".`);
//   });

//   await updateQueue;

//   updateReferenceState(references);
// };


const handleCorrectionWithCitation = async (
  inputText,
  correctedText,
  inTextCitations,
  urls,
  references
) => {
  if (!inputText || !Array.isArray(inTextCitations) || !Array.isArray(urls) || inTextCitations.length !== urls.length) {
    setError("All arguments must be provided, and inTextCitations and urls must be arrays of the same length.");
    return;
  }

  const escapedInputText = inputText.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  const inputTextRegex = new RegExp(`(${escapedInputText})`, 'gi');

  updateQueue = updateQueue.then(async () => {
    const editorContent = decodeHtmlEntities(editorRef.current.innerHTML);

    let updatedContent = editorContent;

    // Replace each instance of inputText with the corrected text and all citations
    updatedContent = updatedContent.replace(inputTextRegex, (match) => {
      const citationsHtml = inTextCitations.map((citation, index) => {
        const url = urls[index];
        return `<a href="${url}" 
                   title="${url}" 
                   target="_blank" 
                   style="text-decoration: underline; background-color: #FFFFFF; cursor: pointer;">
                  ${citation}
                </a>`;
      }).join('&nbsp;');

      return `
        <span style="background-color: #FFFFFF;">
          ${correctedText}&nbsp;${citationsHtml}
        </span>`;
    });

    editorRef.current.innerHTML = updatedContent;

    const updatedReferences = [...referenceArray, ...references];
    setReferenceArray(updatedReferences);

    // Optional: Log success (for debugging)
    console.log(`Replaced "${inputText}" with "${correctedText}" and added multiple citations.`);
  });

  await updateQueue;
};


const updateReferenceState = (metadata) => {
  // Ensure that the referenceText parameter is provided
  if (!metadata) {
      // console.log("No reference text provided.");
      return;
  }

  // Create a copy of the referenceArray state and add the new reference
  const updatedReferences = [...referenceArray, metadata];
  
  // Update the state with the sorted list (we don't need to wait for this update)
  setReferenceArray(updatedReferences);
};



const rewriteText = async (text) => {
    try {
        const data = { query: text };
        const response = await fetch('/api/rewrite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result) {
            return result; // Return the full response object
        } else {
            console.error('No rewritten text returned from the API.');
            return null;
        }
    } catch (error) {
        console.error('Error occurred while rewriting text:', error);
        return null;
    }
};
  // -------------- Extracted from your AppContext --------------
 

  // -------------- Some Basic UI and Helper Functions -----------
  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };
  const closeToast = () => setShowToast(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  // For toggling the side menu
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // -------------- "Web-based" Text Selection + Fact Check ------
  /**
   * getDocumentText():
   * - Grab the user’s selection in the browser,
   * - If no selection, show message;
   * - If there's text, pass it to your fact-check pipeline (splitText, etc.).
   */

//   function removeIntextCitations(strings) {
//     return strings.map(str => {
//         // Remove citations at the start of the string
//         str = str.replace(/^\(\w.*?\)\s*/, '');
//         // Remove citations at the end of the string
//         str = str.replace(/\s*\(\w.*?\)$/g, '');
//         return str;
//     });
// }

  function removeIntextCitations(strings) {
    return strings
        .map(str => {
            // Remove citations at the start of the string
            str = str.replace(/^\(\w.*?\)\s*/, '');
            // Remove citations at the end of the string
            str = str.replace(/\s*\(\w.*?\)$/g, '');
            return str;
        })
        .filter(str => str.length >= 5); // Filter out elements with length less than 3
  }



  const getDocumentText = async () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || "";
    setSelectedText(text);
    
    if (!text) {
      // console.log('No text is selected in the web editor.');
      setCheckEnabled(true);
      showToastNotification("Please highlight a text segment to fact check");
      setOpenSnackbar(true);
      return;
    }

    // In your original code, you did:
    // const res = await splitText(text);
    // setExtractedClaims(res.claims);
    // and then call factcheck(...)

    try {
      setCheckEnabled(false);
      setLoading(true);

      // 1) Split text to identify claims
      const res = await splitText(text, accessToken);
      // console.log("Split text result:", res);

      res.claims = removeIntextCitations(res.claims)

      setExtractedClaims(prevClaims => [...prevClaims, ...res.claims]);

      if (res.claims.length === 0) {
        setOpenSnackbar(true);
        setIsFactChecking(false);
        setCheckEnabled(true);
        return;
      }
      // 2) “Highlight” those claims in the editor (we do a naive approach)
      for (let i = 0; i < res.claims.length; i++) {
        highlightClaimColour(res.claims[i],'#D3D3D3')
        // highlightClaimGrey(res.claims[i]);
      }
      // 3) Now do the fact-check
      factcheck(res.claims, res.context, files);
    } catch (error) {
      console.error('Error during getDocumentText:', error);
      setError("An error occurred while retrieving the selected text.");
    } finally {
      setLoading(false);
    }
  };

  // -------------- Fact Check Logic (Backend / Local) -----------
  /**
   * factcheck:
   * - Takes claims, context, files, etc. and runs `createAndCheckTask` (like your original).
   * - Replaces the Word-run code with direct state manipulations and highlight calls.
   */
  const factcheck = async (claims, context, files) => {
    // console.log("factcheck started with claims:", claims);
    setLoading(true);
    setError(null);
    
    setTotalProcessed(0);

    try {
      // Copy dictionary from state
      const currentDict = { ...dict };

      // Filter new claims if desired
      const newClaims = claims; // or claims.filter(...) if you want
      // console.log({newClaims})
      setClaimsProcessing(claims);

      if (newClaims.length === 0) {
        // console.log('All claims have already been fact-checked.');
        setLoading(false);
        return;
      }

      // Process each new claim
      const promises = newClaims.map(async (claim) => {
        try {
          const { output, error } = await createAndCheckTask(
            claim, 
            "", "", username, "speaker", "", 
            "inline", filter, 
            () => {}, 
            context, 
            files, 
            getClaimsRemaining,
            accessToken,
            backendUrl
          );

          console.log({output})

          if (output?.visualisation_mode) {
            setUserCredits(output?.visualisation_mode?.userCredits);
          }

          if (output?.Classification === "Stopped Processing") {
            // ...
          } else {
            // highlight with color, etc.
            highlightAndCommentClaim(
              claim,
              output?.Classification,
              output?.overall_assessment,
              output?.correction_text
            );

            // Update local states
            setFacts((prev) => [...prev, output]);
            setHistory((prev) => [...prev, output]);
            currentDict[claim] = { output };
            setTotalProcessed((prev) => prev + 1);
          }
        } catch (err) {
          console.error('Fact Check Error for claim:', claim, err);
          currentDict[claim] = {
            error: "An unexpected error occurred during fact-checking."
          };
        }
      });

      await Promise.all(promises);
      setDict(currentDict);
    } catch (err) {
      console.error('factcheck error:', err);
      setError("An unexpected error occurred during fact-checking.");
    } finally {
      setLoading(false);
    }
  };


  let updateQueue = Promise.resolve(); // Queue for serialized updates

  const highlightAndCommentClaim = async (claim, classification, overall_assessment, correction_text) => {
      if (!claim || !editorRef.current) return;

      // Determine the highlight color based on classification
      let color = "transparent";
      switch (classification?.toLowerCase()) {
          case 'true':
              color = '#89F336'; // Green
              break;
          case 'false':
              color = '#FF0000'; // Red
              break;
          case 'unverifiable':
              color = '#FFFF00'; // Yellow
              break;
          default:
              color = '#FFFFFF'; // Default White
              break;
      }
      // console.log({claim})
      
      // Escape special characters in the claim string for use in regex
      const escapedClaim = claim.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
      // console.log({escapedClaim})
      // Create a regex to find the claim within the content
      const claimRegex = new RegExp(`(${escapedClaim})`, 'gi');

      

      // Add the update to the queue
      updateQueue = updateQueue.then(async () => {
          // Get the current content
          // const editorContent = editorRef.current.innerHTML;
          const editorContent = decodeHtmlEntities(editorRef.current.innerHTML)
          // console.log({editorContent})
          // Replace the matched claim with a highlighted span
          const highlightedContent = editorContent.replace(claimRegex, (match) => {
              return `<span style="background-color: ${color};">${match}</span>`;
          });

          // Update the editor content atomically
          editorRef.current.innerHTML = highlightedContent;

          // Optionally log or handle the comment
          // if (overall_assessment || correction_text) {
          //     console.log(`Comment added: ${correction_text} [${overall_assessment}]`);
          // }
      });

      // Wait for the update to finish before resolving
      await updateQueue;
  };

  function decodeHtmlEntities(str) {
    const htmlEntityDictionary = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'", // Apostrophe
      "&copy;": "©",
      "&reg;": "®",
      "&trade;": "™",
      "&euro;": "€",
      "&pound;": "£",
      "&yen;": "¥",
      "&cent;": "¢",
      "&sect;": "§",
      "&laquo;": "«",
      "&raquo;": "»",
      "&hellip;": "…",
      "&mdash;": "—",
      "&ndash;": "–",
      "&nbsp;": " ",
      "&deg;": "°",
      "&times;": "×",
      "&divide;": "÷",
      "&plusmn;": "±",
      "&para;": "¶",
      "&micro;": "µ",
      "&infin;": "∞",
      "&radic;": "√",
      "&ne;": "≠",
      "&le;": "≤",
      "&ge;": "≥"
    };
  
    // Create a regex that matches all keys in the dictionary
    const entityRegex = new RegExp(Object.keys(htmlEntityDictionary).join("|"), "g");
  
    // Replace each matched entity with its corresponding character
    return str.replace(entityRegex, match => htmlEntityDictionary[match] || match);
  }

  const highlightClaimColour = async (claim, color) => {
    // console.log("Actual editor content:", editorRef.current.innerHTML);
    // console.log("Claim:", claim);
    // const ampclaim = decodeHtmlEntities(editorRef.current.innerHTML);
    // console.log("Amp:",ampclaim)
    if (!claim) return;
  
    // Escape special characters in the claim to safely use it in a regular expression
    const escapedClaim = claim.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  
    // Create a case-insensitive regular expression to match the claim
    const claimRegex = new RegExp(`(${escapedClaim})`, 'gi');
    // console.log({claimRegex})
    // Ensure that updates are processed sequentially
    updateQueue = updateQueue.then(async () => {
      const editorContent = decodeHtmlEntities(editorRef.current.innerHTML);
      // Replace the matched claim with a highlighted span using the specified color
      const highlightedContent = editorContent.replace(claimRegex, (match) => {
        return `<span style="background-color: ${color};">${match}</span>`;
      });
      // console.log({highlightedContent})
      // Update the editor's content with the highlighted text
      editorRef.current.innerHTML = highlightedContent;
    });
  
    // Wait for the update queue to complete
    await updateQueue;
  };
  

  const handleDismiss = (factInput) => {
    setFacts((prevFacts) =>
      prevFacts.map((fact) =>
        fact.input === factInput ? { ...fact, done: true } : fact
      )
    );
    handleDismissal(factInput)
  };

  const handleAdd = (factInput, factCorrection, reference) =>{
    handleAddition(factInput, factCorrection)
    updateReferenceState(reference)
  }


  const handleDismissal = async (claim) => {
    if (!claim) return;

    const escapedClaim = claim.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");

    const claimRegex = new RegExp(`(${escapedClaim})`, 'gi');

    updateQueue = updateQueue.then(async () => {
      // const editorContent = editorRef.current.innerHTML;
      const editorContent = decodeHtmlEntities(editorRef.current.innerHTML)
      // Replace the matched claim with a highlighted span
      const highlightedContent = editorContent.replace(claimRegex, (match) => {
          return `<span style="background-color: #FFFFFF;">${match}</span>`;
      });
      
      editorRef.current.innerHTML = highlightedContent;
    });

    await updateQueue;
  };

  const handleAddCitation = (factInput, factCorrection, intext, url, reference) =>{
    handleAdditionWithCitation(factInput, factCorrection, intext, url, reference)
    updateReferenceState(reference)
  }


  const handleAdditionWithCitation = async (inputText, correctedText, inTextCitation, url) => {
    if (!inputText || !inTextCitation || !url) {
      // console.log("All arguments must be provided.");
      setError("All arguments (inputText, correctedText, inTextCitation, url) must be provided.");
      return;
    }
  
    try {
      // Escape special characters in the input text for regex
      const escapedInputText = inputText.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
      const inputTextRegex = new RegExp(escapedInputText, 'gi');
  
      // Use a promise queue to ensure sequential updates
      updateQueue = updateQueue.then(async () => {
        // const editorContent = editorRef.current.innerHTML;
        const editorContent = decodeHtmlEntities(editorRef.current.innerHTML)
        // Replace matched inputText with correctedText and in-text citation as a hyperlink
        const updatedContent = editorContent.replace(inputTextRegex, (match) => {
          const correctedSpan = `<span style="background-color: white; color: black;">${correctedText}</span>`;
          const citationLink = `<a href="${url}" style="text-decoration: underline; background-color: white; color: black;">${inTextCitation}</a>`;
          // Wrap the corrected text and citation in a single span to avoid gaps
          return `<span style="background-color: white; color: black;">${match} ${correctedSpan}&nbsp;${citationLink}</span>`;
        });
  
        // Update the editor's innerHTML
        editorRef.current.innerHTML = updatedContent;
      });
  
      await updateQueue;
  
      // console.log(`Appended "${correctedText}" to "${inputText}" and added an in-text citation "${inTextCitation}" as an HTML hyperlink to "${url}".`);
    } catch (error) {
      console.error("An error occurred while processing the addition with citation:", error);
      setError("An error occurred while updating the content.");
    }
  };
  
  
  

  // -------------- Rewrite Logic (Web-based) --------------------
  /**
   * rewriteDocumentText():
   * - Instead of Word selection, we read from `selectedText`
   * - Then call your `rewriteText` function from `utils` if desired
   * - Finally, do a naive replace in editorHtml
   */
  const rewriteDocumentText = async () => {
    if (!selectedText) {
      // console.log("Selected text must be provided.");
      setError("Selected text must be provided.");
      return;
    }
  
    setCheckEnabled(false);
  
    try {
      const res = await rewriteText(selectedText);
      // console.log("Rewrite result:", res);
  
      if (!res?.rewrite || !res?.summary) {
        // console.log("Rewrite or summary missing in response.");
        setError("Rewrite or summary missing in response.");
        return;
      }
  
      const escapedInputText = selectedText.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
      const inputTextRegex = new RegExp(escapedInputText, 'gi');
  
      // Use a promise queue to ensure sequential updates
      updateQueue = updateQueue.then(async () => {
        // const editorContent = editorRef.current.innerHTML;
        const editorContent = decodeHtmlEntities(editorRef.current.innerHTML)
  
        // Replace matched inputText with correctedText
        const updatedContent = editorContent.replace(inputTextRegex, (match) => {
          // Wrap the corrected text in a styled span to ensure formatting
          return `<span style="background-color: white; color: black;">${res.rewrite}</span>`;
        });
        // console.log({inputTextRegex})
        // console.log({updatedContent})
        // Update the editor's innerHTML
        editorRef.current.innerHTML = updatedContent;
      });
  
      // console.log(`Replaced "${escapedInputText}" with "${res.rewrite}" and applied styling.`);
    } catch (error) {
      console.error("An error occurred while rewriting text:", error);
      setError("An error occurred while rewriting text.");
    } finally {
      setCheckEnabled(true);
    }
  };
  
  

  // -------------- “Dummy” placeholders for Word-based calls ----
  // Remove or adapt these to your web environment
const handleCorrection = async (inputText, correctedText) => {
  if (!inputText || !correctedText) {
    // console.log("Both input and corrected text must be provided.");
    setError("Both input and corrected text must be provided.");
    return;
  }

  try {
    // Escape special characters in the input text for regex
    const escapedInputText = inputText.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
    const inputTextRegex = new RegExp(escapedInputText, 'gi');

    // Use a promise queue to ensure sequential updates
    updateQueue = updateQueue.then(async () => {
      // const editorContent = editorRef.current.innerHTML;
      const editorContent = decodeHtmlEntities(editorRef.current.innerHTML)

      // Replace matched inputText with correctedText
      const updatedContent = editorContent.replace(inputTextRegex, (match) => {
        // Wrap the corrected text in a styled span to ensure formatting
        return `<span style="background-color: white; color: black;">${correctedText}</span>`;
      });

      // Update the editor's innerHTML
      editorRef.current.innerHTML = updatedContent;
    });

    await updateQueue;

  } catch (error) {
    console.error("An error occurred while processing the correction:", error);
    setError("An error occurred while replacing the text.");
  }
};


  const handleAddition = async (inputText, correctedText) => {
    if (!inputText || !correctedText) {
      // console.log("Both input and corrected text must be provided.");
      setError("Both input and corrected text must be provided.");
      return;
    }
  
    const escapedInputText = inputText.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
    const inputTextRegex = new RegExp(`(${escapedInputText})`, 'gi');
  
    updateQueue = updateQueue.then(async () => {
      // const editorContent = editorRef.current.innerHTML;
      const editorContent = decodeHtmlEntities(editorRef.current.innerHTML)
  
      const updatedContent = editorContent.replace(inputTextRegex, (match) => {
        // Combine the input text with corrected text, ensuring consistent background color
        return `<span style="background-color: #FFFFFF;">${match} ${correctedText}</span>`;
      });
  
      editorRef.current.innerHTML = updatedContent;
      // console.log(`Added "${correctedText}" to "${inputText}" with a white background.`);
    });
  
    await updateQueue;
  };
  

  // -------------- References Logic (Optional) -------------------
  /**
   * In a pure web app, you can just store references in state
   * and display them below the editor or in a references tab.
   */
  const addReferencesToDocument = () => {
    updateQueue = updateQueue.then(async () => {
      try {
        // 1. Generate the references first
        const referencesWithStrings = referenceArray.map((ref) => {
          const apaString = APAUtility.generateAPAReference(ref);
  
          // Find the first author name or fallback text, converting to lowercase
          let firstAuthor;
          const authorStr = APAUtility.formatAuthors(ref.authors);
  
          if (authorStr) {
            firstAuthor = authorStr.split(',')[0].toLowerCase();
          } else {
            firstAuthor = APAUtility.getFallbackAuthor(ref).toLowerCase();
          }
  
          return { apaString, firstAuthor };
        });
  
        // 2. Sort by the first author's name
        referencesWithStrings.sort((a, b) => a.firstAuthor.localeCompare(b.firstAuthor));
  
        // 3. Extract the sorted APA strings
        const apaReferenceStrings = referencesWithStrings.map(item => item.apaString);
  
        // 4. Append to innerHTML
        if (editorRef.current) {
          const referenceStartMarker = "[References Start]";
          const referenceEndMarker = "[References End]";
  
          // const editorContent = editorRef.current.innerHTML;
          const editorContent = decodeHtmlEntities(editorRef.current.innerHTML)
          // Check for existing reference markers
          const startIndex = editorContent.indexOf(referenceStartMarker);
          const endIndex = editorContent.indexOf(referenceEndMarker);
  
          if (startIndex !== -1 && endIndex !== -1) {
            // Replace existing references
            const beforeReferences = editorContent.substring(0, startIndex + referenceStartMarker.length);
            const afterReferences = editorContent.substring(endIndex);
  
            editorRef.current.innerHTML = `${beforeReferences}\n${apaReferenceStrings.join('<br/>')}\n${afterReferences}`;
          } else {
            // Append references if markers don't exist
            editorRef.current.innerHTML += `\n${referenceStartMarker}<br/>${apaReferenceStrings.join('<br/>')}<br/>${referenceEndMarker}`;
          }
        }
      } catch (error) {
        console.error("Error adding references:", error);
      }
    });
  
    // Handle potential errors in the queue
    updateQueue.catch((error) => {
      console.error("An error occurred while processing the update queue:", error);
    });
  };
  
  

  useEffect(() => {
    const handleSelectionChange = () => {
      const selectionText = window.getSelection()?.toString()?.trim();
      setSelectedText(selectionText || "");
    };
    
    
    // Add event listeners for mouseup and keyup
    document.addEventListener("mouseup", handleSelectionChange);
    document.addEventListener("keyup", handleSelectionChange);
  
    return () => {
      // Clean up event listeners
      document.removeEventListener("mouseup", handleSelectionChange);
      document.removeEventListener("keyup", handleSelectionChange);
    };
  }, []);



  useEffect(() => {
    const handleCursorPosition = () => {
      const selection = window.getSelection();
  
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // Get the current range of the selection
        const containerText = range.startContainer.textContent; // Full text of the container
        
        // console.log({containerText})
        if (containerText) {
          const cursorOffset = range.startOffset; // Cursor position within the container
          // console.log({cursorOffset})
          // Example claims array
          // const claims = ["example claim 1", "another claim", "a sample text"];
  
          // Call getClaimAtCursor with containerText, cursorOffset, and claims
          const matchingClaim = getClaimAtCursor(containerText, cursorOffset, extractedClaims);
          // console.log({matchingClaim})
          // console.log({selectedClaim})
          if (matchingClaim) {
            // console.log("Yes")
            // setClaimWithQueue(matchingClaim);
            setSelectedClaim(matchingClaim)
            // console.log("setting claim")
          }          
          // console.log("set selected claim")
          // console.log(`Matching claim at cursor: ${matchingClaim}`);
        }
      }
    };
  
    // Add event listeners for keyup and click to track cursor position
    // document.addEventListener("keyup", handleCursorPosition);
    document.addEventListener("mouseup", handleCursorPosition);
  
    return () => {
      // Clean up event listeners
      // document.removeEventListener("keyup", handleCursorPosition);
      document.removeEventListener("mouseup", handleCursorPosition);
    };
  }, [extractedClaims]);
  
  
  function getClaimAtCursor(containerText, cursorOffset, claims) {
    // Initialize a variable to store the matching claim
    let matchingClaim = null;
    
    // Extract surrounding text for context (optional, enhances focus)
    // const contextRadius = 20; // Adjust this for more/less context
    // const start = Math.max(0, cursorOffset - contextRadius);
    // const end = Math.min(containerText.length, cursorOffset + contextRadius);
    // const surroundingText = containerText.substring(start, end);
    // console.log({claims})
    // Iterate through each claim to find the best match
    claims.forEach(claim => {
      // Use string-similarity to compare the claim and surrounding text
      const similarity = stringSimilarity.compareTwoStrings(containerText, claim);
      // console.log({containerText, claim})
      // Define a threshold for fuzzy matching (e.g., 0.7 for 70%)
      const similarityThreshold = 0.8;
  
      if (similarity >= similarityThreshold) {
        // Check if the claim overlaps the cursor position
      
          matchingClaim = claim;
          return; // Exit early if a match is found
      }
    });
  
    // console.log(`Matching claim: ${matchingClaim}`);
    return matchingClaim;
  }

  
  // -------------- Word Count for the selected text ---------------
  const getWordCount = (text) => {
    if (!text) return 0;
    const words = text.trim().split(/\s+/);
    return words[0] === '' ? 0 : words.length;
  };


  const wordCount = getWordCount(selectedText);

  // -------------- Tab UI Switcher --------------------------------
  const chipLabels = ['View All', 'True', 'False', 'Unverifiable'];
  const chipDict =  {'View All':0, 'True':1, 'False':2, 'Unverifiable':3}
  const [selectedTab, setSelectedTab] = useState(0);
  
 
 
  const handleChipClick = (index) => {
    setSelectedTab(index);
    setSelectedClaim("");
  };


  useEffect(() => {

    if (!selectedClaim || !facts || facts.length === 0) return;

    if (selectedTab !== 0){
    // Find the first fact that matches the selectedClaim
    const matchingFact = facts.find((fact) => fact.input === selectedClaim);

    if (matchingFact) {
      // console.log(`Classification for input "${matchingFact.input}":`, matchingFact.Classification);

      const desiredTab = chipDict[matchingFact.Classification];

      // Only update the tab if it's different from the current one and not 'View All'
      if (desiredTab !== selectedTab && desiredTab !== undefined && desiredTab !== 0) {
        setSelectedTab(desiredTab);
      }
    }
    }

  }, [selectedClaim]); // Removed `selectedTab` from dependencies


  // const [sortedFacts, setSortedFacts] = useState([]);


  // useEffect(()=>{
  //   const sorted = [...facts]
  //   .filter((fact) => !fact.done)
  //   .sort((a, b) => {
  //     if (selectedClaim === "") return 0; // Do not select if selectedClaim is empty
  //     if (a.input === selectedClaim && b.input !== selectedClaim) return -1;
  //     if (a.input !== selectedClaim && b.input === selectedClaim) return 1;
  //     return 0;
  //   });
  //   setSortedFacts(sorted)
  //   console.log({sorted})
  // },[selectedClaim,facts])

  // useEffect(() => {
  //   // Check if selectedClaim is empty or hasn't changed
  //   // if (selectedClaim !== "" || sortedFacts[0].input !== selectedClaim) {
  //     const sorted = [...facts]
  //       .filter((fact) => !fact.done)
  //       .sort((a, b) => {
  //         if (a.input === selectedClaim && b.input !== selectedClaim) return -1;
  //         if (a.input !== selectedClaim && b.input === selectedClaim) return 1;
  //         return 0;
  //       });
  //     setSortedFacts(sorted);
  //   // }
  //   // console.log({ selectedClaim, sortedFacts });
  // }, [selectedClaim, facts, sortedFacts]);
  

  // -------------- Render Content for Each Tab --------------------
  const renderContent = () => {
    switch (activeTab) {
      case 'factCheck':
        
        const sortedFacts = [...facts]
          .filter((fact) => !fact.done)
          .sort((a, b) => {
            if (selectedClaim === "") return 0; // Do not select if selectedClaim is empty
            if (a.input === selectedClaim && b.input !== selectedClaim) return -1;
            if (a.input !== selectedClaim && b.input === selectedClaim) return 1;
            return 0;
          });

        // const sortedFacts = [...facts].filter((fact) => !fact.done);

      
        return (
          <Box 
          // sx={{ mt: 2, display: 'flex', flexDirection: 'column', height: '100vh' }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              width: '100%',
              overflow: 'hidden',
              borderRadius: 1,
              boxShadow: 2,
            }}
            >
            {/* Top Menu with Chips */}
            <br></br>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                borderBottom: 1,
                borderColor: 'divider',
                paddingBottom: 1,
                flexWrap: 'wrap',
              }}
            >
                {chipLabels.map((label, index) => (
                  <Chip
                    key={label}
                    label={`${label} (${tabNum[label] ?? 0})`}
                    clickable
                    onClick={() => handleChipClick(index)}
                    sx={{
                      backgroundColor: selectedTab === index ? '#0066FF' : 'transparent',
                      color: selectedTab === index ? '#fff' : 'inherit',
                      borderColor: selectedTab === index ? '#0066FF' : 'inherit',
                      fontWeight: 'bold', // Make the text bold
                    }}
                    variant={selectedTab === index ? 'filled' : 'outlined'}
                  />
                ))}
            </Box>

            {/* Info about selected words */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                {wordCount === 0
                  ? '0 words selected.'
                  : `${wordCount} word${wordCount !== 1 ? 's' : ''} selected.`}
              </Typography>
            </Box>

            {/* FactList */}
            <Box sx={{ flex: '1 1 auto', overflow: 'auto', p: 2 }}>
              <FactList
                facts={sortedFacts}
                // Expose your handleCorrect, handleAdd, etc. if you want
                onCorrect={handleCorrection}
                onCorrectHyperlink = {handleCorrectionWithCitation}
                handleAdd={handleAdd}
                handleAddCitation={handleAddCitation}
                onDismiss={handleDismiss}
                commentClaim={() => {}}
                filter={chipLabels[selectedTab] || 'View All'}
              />
            </Box>

            {/* Lower Section - ClaimsProcessingModule + Buttons */}
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                Nothing found to fact check.
              </Alert>
            </Snackbar>

            <Box
              sx={{
                flex: '0 0 20%',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ClaimsProcessingModule
                claims={claimsProcessing}
                facts={sortedFacts}
                setClaimsProcessing={setClaimsProcessing}
                totalProcessed={totalProcessed}
                rewriteDocumentText={rewriteDocumentText}
                handleCheck={getDocumentText}
                claimsRemaining={claimsRemaining}
                setClaimsRemaining={setClaimsRemaining}
                wordCount={wordCount}
              />
            </Box>
          </Box>
        );
      case 'chat':
        return <PlaceholderContent title="Chat" />;
      case 'references':
        // ReferenceList – you can keep your existing logic
        return <ReferenceList addReferences={addReferencesToDocument} />;
      case 'settings':
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Select Font Size:
            </Typography>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="font-size-select-label">Font Size</InputLabel>
              <Select
                labelId="font-size-select-label"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                label="Font Size"
              >
                <MenuItem value="10px">10px</MenuItem>
                <MenuItem value="12px">12px</MenuItem>
                <MenuItem value="14px">14px</MenuItem>
                <MenuItem value="16px">16px</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      default:
        return <PlaceholderContent title="Welcome" />;
    }
  };

  // -------------- Utility Functions from original code ----------
  function getClaimsRemaining() {
    return claimsRef.current;
  }


  // -------------- Render ----------------------------------------
  return (
    <Box sx={{ display: 'flex', height: '90vh', width: '100%' }}>
      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, padding: 0.1, backgroundColor: '#F1F3FE', overflowY: 'auto' }}>
        {renderContent()}
      </Box>

      {/* Side Menu */}
      <Box
        sx={{
          width: 40,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid #ddd',
          paddingY: 2,
          position: 'relative',
        }}
      >
        {/* Top Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tooltip title="Facticity.ai" placement="right">
            <a href="https://facticity.ai" style={{ textDecoration: 'none' }}>
              <img
                src="https://storage.googleapis.com/public_resources_seer/icon-80.png"
                style={{
                  paddingTop: '12px',
                  width: 'auto',
                  height: '30px',
                }}
                alt="Facticity"
              />
            </a>
          </Tooltip>
          <Tooltip title="Fact Check" placement="left">
            <IconButton
              color={activeTab === 'factCheck' ? 'primary' : 'default'}
              onClick={() => setActiveTab('factCheck')}
              sx={{ padding: 1 }}
            >
              <SearchIcon sx={{ fontSize: 25 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="References" placement="left">
            <IconButton
              color={activeTab === 'references' ? 'primary' : 'default'}
              onClick={() => setActiveTab('references')}
              sx={{ padding: 1 }}
            >
              <FormatQuoteIcon sx={{ fontSize: 25 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Bottom Button */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tooltip title="Settings" placement="left">
            <IconButton
              color={activeTab === 'settings' ? 'primary' : 'default'}
              onClick={() => setActiveTab('settings')}
              sx={{ padding: 1 }}
            >
              <SettingsIcon sx={{ fontSize: 25 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Profile" placement="left">
            <Profile sx={{ fontSize: 25 }} />
          </Tooltip>
        </Box>
        {/* <br></br> */}
      </Box>
    </Box>
  );
};

// A simple placeholder for any unimplemented tab content
const PlaceholderContent = ({ title }) => (
  <Box
    sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 1,
      boxShadow: 1,
      padding: 4,
    }}
  >
    <h2>{title} Section</h2>
  </Box>
);

export default Taskpane;

