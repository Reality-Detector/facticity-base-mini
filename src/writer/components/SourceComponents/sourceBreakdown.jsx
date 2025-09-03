// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Menu,
//   MenuItem,
//   Button,
//   Collapse,
//   Divider,
//   Checkbox
// } from '@mui/material';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// import ClickSourceLink from './hoverSource';
// import { formatInTextCitation } from '../utils';

// const SourceBreakdown = ({ fact, sourcesOpen, handleAdd }) => {
//   const sourcesArray = fact.sources_array || {};

//   // For visuals
//   const lineHeightValue = '1.5';
//   const fontSize = '0.875rem';

//   // Dictionary of anchors: { "Supporting-0": DOMElement | null, ... }
//   const [menuAnchorEls, setMenuAnchorEls] = useState({});

//   // State to enable multi-select mode in the "Supporting" section
//   const [isSupportingMultiSelect, setIsSupportingMultiSelect] = useState(false);

//   // Keep track of which sources in the supporting section are currently selected
//   const [supportingSelectedSources, setSupportingSelectedSources] = useState([]);

//   // Opens the dropdown menu for a specific uniqueKey
//   const handleMenuOpen = (event, uniqueKey) => {
//     event.stopPropagation();
//     setMenuAnchorEls((prev) => ({
//       ...prev,
//       [uniqueKey]: event.currentTarget,
//     }));
//   };

//   // Closes the dropdown menu for a specific uniqueKey
//   const handleMenuClose = (event, uniqueKey) => {
//     event?.stopPropagation();
//     setMenuAnchorEls((prev) => ({
//       ...prev,
//       [uniqueKey]: null,
//     }));
//   };

//   // Toggle multi-select mode for supporting sources
//   const handleToggleMultiSelect = (e) => {
//     e.stopPropagation();
//     // If turning off multi-select, also clear any checked boxes
//     if (isSupportingMultiSelect) {
//       setSupportingSelectedSources([]);
//     }
//     setIsSupportingMultiSelect((prev) => !prev);
//   };

//   // Insert the selected supporting sources (in multi-select mode)
//   const handleInsertSelectedSources = () => {
//     // For example: combine all selected source summaries (with or without citations)
//     // In real usage, you'd decide how to handleAdd them collectively
//     const combinedSummary = supportingSelectedSources
//       .map((src) => {
//         const summaryWithCitation =
//           (src.summary ?? '') + formatInTextCitation(src.metadata);
//         return summaryWithCitation;
//       })
//       .join('\n'); // or separate them however you want

//     handleAdd(fact.input, combinedSummary, null);
//   };

//   // When user toggles the checkbox in multi-select mode
//   const handleCheckboxChange = (source, checked) => {
//     setSupportingSelectedSources((prevSelected) => {
//       if (checked) {
//         // Add the source
//         return [...prevSelected, source];
//       } else {
//         // Remove the source
//         return prevSelected.filter((item) => item !== source);
//       }
//     });
//   };

//   const handleAcceptNoCitations = (event, source, uniqueKey) => {
//     event.stopPropagation();
//     handleAdd(fact.input, source.summary ?? '', null);
//     handleMenuClose(event, uniqueKey);
//   };

//   const handleAcceptWithCitations = (event, source, uniqueKey) => {
//     event.stopPropagation();
//     handleAdd(
//       fact.input,
//       (source.summary ?? '') + formatInTextCitation(source.metadata),
//       null
//     );
//     handleMenuClose(event, uniqueKey);
//   };

//   /**
//    * Helper to render a group (section title + list of sources).
//    * We rely on `uniqueKey` to store anchor state (so no collisions).
//    */
//   const renderSection = (title, sourceList) => {
//     // If no sources in this section, skip it
//     if (!sourceList || sourceList.length === 0) return null;

//     // We only care about multi-select toggling for the "Supporting" group
//     const isSupportingSection = title === 'Supporting';

//     return (
//       <Box mb={1} sx={{ pl: 1.5 }}>
//         {/* Section header */}
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           sx={{ mb: 0.5 }}
//         >
//           <Typography
//             variant="subtitle2"
//             sx={{
//               fontWeight: 'bold',
//               lineHeight: lineHeightValue,
//               fontSize,
//             }}
//           >
//             {title}
//           </Typography>

//           {/* Only show the "Select Multiple Sources" button for the Supporting section */}
//           {isSupportingSection && (
//             <Button
//               variant="text"
//               onClick={handleToggleMultiSelect}
//               sx={{
//                 border: 'none',
//                 color: 'black',
//                 backgroundColor: 'transparent',
//                 textTransform: 'none',
//               }}
//             >
//               {isSupportingMultiSelect
//                 ? 'Cancel Multiple Selection'
//                 : 'Select Multiple Sources'}
//             </Button>
//           )}
//         </Box>

//         {/* List of sources */}
//         {sourceList.map((source, index) => {
//           // e.g., "Supporting-0", "Supporting-1", "Counterarguments-0", etc.
//           const uniqueKey = `${title}-${index}`;

//           const updateData = (updatedData) => {
//             // If you mutate the array in place, be aware of potential side effects.
//             sourceList[index].metadata = updatedData;
//           };

//           // If in multi-select mode for "Supporting", show a checkbox
//           const showCheckbox =
//             isSupportingSection && isSupportingMultiSelect;

//           return (
//             <Paper
//               key={uniqueKey}
//               variant="outlined"
//               sx={{ p: 1, mb: 1, backgroundColor: 'background.default' }}
//             >
//               <Typography
//                 variant="body2"
//                 sx={{
//                   color: 'text.secondary',
//                   mb: 0.5,
//                   lineHeight: lineHeightValue,
//                   fontSize,
//                 }}
//               >
//                 {source.summary}
//               </Typography>

//               {source.metadata?.website && (
//                 <ClickSourceLink source={source} updateData={updateData} />
//               )}

//               {!showCheckbox ? (
//                 // Original Accept button + dropdown if not in multi-select mode
//                 <Box
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                 >
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={(e) => handleMenuOpen(e, uniqueKey)}
//                     sx={{
//                       mr: 0.5,
//                       px: 1,
//                       backgroundColor: '#1E9AFF',
//                       color: 'white',
//                       boxShadow: 'none',
//                       '&:hover': {
//                         backgroundColor: '#156DBF',
//                       },
//                     }}
//                     endIcon={<KeyboardArrowDownIcon />}
//                   >
//                     Accept
//                   </Button>

//                   <Menu
//                     anchorEl={menuAnchorEls[uniqueKey] || null}
//                     open={Boolean(menuAnchorEls[uniqueKey])}
//                     onClose={(e) => handleMenuClose(e, uniqueKey)}
//                     keepMounted
//                   >
//                     <MenuItem
//                       onClick={(e) =>
//                         handleAcceptNoCitations(e, source, uniqueKey)
//                       }
//                     >
//                       without citation
//                     </MenuItem>
//                     <MenuItem
//                       onClick={(e) =>
//                         handleAcceptWithCitations(e, source, uniqueKey)
//                       }
//                     >
//                       with citations
//                     </MenuItem>
//                   </Menu>
//                 </Box>
//               ) : (
//                 // Show a checkbox to select/unselect this source
//                 <Box>
//                   <Checkbox
//                     checked={supportingSelectedSources.includes(source)}
//                     onChange={(e) =>
//                       handleCheckboxChange(source, e.target.checked)
//                     }
//                   />
//                 </Box>
//               )}
//             </Paper>
//           );
//         })}

//         {/* If in multi-select mode for the Supporting section, show an Insert button at the bottom */}
//         {isSupportingSection && isSupportingMultiSelect && (
//           <Box mt={1}>
//             <Button
//               variant="contained"
//               onClick={handleInsertSelectedSources}
//             >
//               Insert ({supportingSelectedSources.length})
//             </Button>
//           </Box>
//         )}
//       </Box>
//     );
//   };

//   // Define each group of sources with a label and the corresponding list
//   const groups = [
//     { title: 'Supporting', items: sourcesArray.positive },
//     { title: 'Counterarguments', items: sourcesArray.negative },
//     { title: 'Neutral', items: sourcesArray.neutral },
//   ];

//   return (
//     <Collapse in={sourcesOpen}>
//       <Divider sx={{ mt: 1, mb: 1 }} />

//       {groups.map((group) => renderSection(group.title, group.items))}
//     </Collapse>
//   );
// };

// export default SourceBreakdown;


import React, { useState, useContext  } from 'react';
import {
  Box,
  Typography,
  Paper,
  Menu,
  MenuItem,
  Button,
  Collapse,
  Divider,
  Checkbox
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import ClickSourceLink from './hoverSource';
import { formatInTextCitation } from '../citations/APAutility';
import { AppContext } from '../AppContext';
const SourceBreakdown = ({ fact, sourcesOpen, handleAdd, handleAddCitation}) => {
  const sourcesArray = fact.sources_array || {};
  const { setReferenceArray } = useContext(AppContext);
  // For visuals
  const lineHeightValue = '1.5';
  const fontSize = '0.875rem';

  // Dictionary of anchors: { "Supporting-0": DOMElement | null, ... }
  const [menuAnchorEls, setMenuAnchorEls] = useState({});

  /**
   * === MULTI-SELECT LOGIC ===
   */
  // Single toggle for multi-select across all groups
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  // Keep track of all selected sources (from any group)
  const [selectedSources, setSelectedSources] = useState([]);

  const handleToggleMultiSelect = () => {
    // If turning off multi-select, also clear any checked boxes
    if (isMultiSelect) {
      setSelectedSources([]);
    }
    setIsMultiSelect((prev) => !prev);
  };

  // Insert the selected sources all at once
  const handleInsertSelectedSources = () => {
    // Ensure selectedSources is an array and has content
    if (!selectedSources || selectedSources.length === 0) {
      console.warn("No sources selected to insert.");
      return;
    }
  
    var references = []
    // Iterate over selectedSources and add each source citation
    selectedSources.forEach((src) => {
      // Add each citation using handleAddCitation
      handleAddCitation(
        fact.input, // The input fact or context
        src.summary ?? '', // Use the summary, default to an empty string if not available
        formatInTextCitation(src.metadata), // Format in-text citation using metadata
        src.metadata.url, // Include the source URL
        null // Assuming the last argument is optional or null
      );
      references.push(src.metadata)
    });
    
    setReferenceArray((prevReferences) => [...prevReferences, ...references]);
  };
  
  // When user toggles the checkbox in multi-select mode
  const handleCheckboxChange = (source, checked) => {
    setSelectedSources((prevSelected) => {
      if (checked) {
        // Add the source if not already in there
        return [...prevSelected, source];
      } else {
        // Remove the source
        return prevSelected.filter((item) => item !== source);
      }
    });
  };

  /**
   * === MENU LOGIC FOR SINGLE-SELECTION ACCEPT ===
   */
  // Opens the dropdown menu for a specific uniqueKey
  const handleMenuOpen = (event, uniqueKey) => {
    event.stopPropagation();
    setMenuAnchorEls((prev) => ({
      ...prev,
      [uniqueKey]: event.currentTarget,
    }));
  };

  // Closes the dropdown menu for a specific uniqueKey
  const handleMenuClose = (event, uniqueKey) => {
    event?.stopPropagation();
    setMenuAnchorEls((prev) => ({
      ...prev,
      [uniqueKey]: null,
    }));
  };

  const handleAcceptNoCitations = (event, source, uniqueKey) => {
    event.stopPropagation();
    handleAdd(fact.input, source.summary ?? '', source.metadata);
    handleMenuClose(event, uniqueKey);
  };

  const handleAcceptWithCitations = (event, source, uniqueKey, noText = false) => {
    event.stopPropagation();
    if (!noText){
      handleAddCitation(
        fact.input,
        (source.summary ?? ''),
        formatInTextCitation(source.metadata),
        source.metadata.url,
        source.metadata
      );
      handleMenuClose(event, uniqueKey);
    } else{
      handleAddCitation(
        fact.input,
        '',
        formatInTextCitation(source.metadata),
        source.metadata.url,
        source.metadata
      );
      handleMenuClose(event, uniqueKey);      
    }

  };


  /**
   * Helper to render a group (section title + list of sources).
   * We rely on `uniqueKey` to store anchor state (so no collisions).
   */
  const renderSection = (title, sourceList) => {
    // If no sources in this section, skip it
    if (!sourceList || sourceList.length === 0) return null;

    return (
      <Box mb={1} sx={{ pl: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 'bold',
            mb: 0.5,
            lineHeight: lineHeightValue,
            fontSize,
          }}
        >
          {title}
        </Typography>

        {/* List of sources */}
        {sourceList.map((source, index) => {
          // e.g., "Supporting-0", "Supporting-1", "Counterarguments-0", etc.
          const uniqueKey = `${title}-${index}`;

          const updateData = (index, updatedData) => {
            // If you mutate the array in place, be aware of potential side effects.
            console.log({sourceList})
            sourceList[index].metadata = updatedData;
            console.log({sourceList})
          };

          // If in multi-select mode, show a checkbox instead of Accept button
          if (isMultiSelect) {
            return (
              <Paper
                key={uniqueKey}
                variant="outlined"
                sx={{ p: 1, mb: 1, backgroundColor: 'background.default' }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 0.5,
                    lineHeight: lineHeightValue,
                    fontSize,
                  }}
                >
                  {source.summary}
                </Typography>

                {source.metadata?.website && (
                  <ClickSourceLink key = {index} index = {index} metadata={source.metadata} updateData={updateData} />
                )}

                <Box>
                  <Checkbox
                    checked={selectedSources.includes(source)}
                    onChange={(e) =>
                      handleCheckboxChange(source, e.target.checked)
                    }
                  />
                </Box>
              </Paper>
            );
          }

          // Otherwise, single-selection (Accept button + dropdown)
          return (
            <Paper
              key={uniqueKey}
              variant="outlined"
              sx={{ p: 1, mb: 1, backgroundColor: 'background.default' }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mb: 0.5,
                  lineHeight: lineHeightValue,
                  fontSize,
                }}
              >
                {source.summary}
              </Typography>

              {source.metadata?.website && (
                <ClickSourceLink key = {index} index = {index}  metadata={source.metadata} updateData={updateData} />
              )}

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {/* Accept button with a dropdown */}
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => handleMenuOpen(e, uniqueKey)}
                  sx={{
                    mr: 0.5,
                    px: 1,
                    backgroundColor: '#1E9AFF',
                    color: 'white',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#156DBF',
                    },
                  }}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Accept
                </Button>

                <Menu
                  anchorEl={menuAnchorEls[uniqueKey] || null}
                  open={Boolean(menuAnchorEls[uniqueKey])}
                  onClose={(e) => handleMenuClose(e, uniqueKey)}
                  keepMounted
                >
                  <MenuItem
                    onClick={(e) =>
                      handleAcceptNoCitations(e, source, uniqueKey)
                    }
                  >
                    without citation
                  </MenuItem>
                  <MenuItem
                    onClick={(e) =>
                      handleAcceptWithCitations(e, source, uniqueKey, false)
                    }
                  >
                    with citations
                  </MenuItem>
                  <MenuItem
                    onClick={(e) =>
                      handleAcceptWithCitations(e, source, uniqueKey, true)
                    }
                  >
                    just citation
                  </MenuItem>
                </Menu>
              </Box>
            </Paper>
          );
        })}
      </Box>
    );
  };

  // Define each group of sources with a label and the corresponding list
  const groups = [
    { title: 'Supporting', items: sourcesArray.positive },
    { title: 'Counterarguments', items: sourcesArray.negative },
    { title: 'Neutral', items: sourcesArray.neutral },
  ];

  return (
    <Collapse in={sourcesOpen}>
      <Divider sx={{ mt: 1, mb: 1 }} />

      {/* TOP RIGHT BUTTON (outside the groups) */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={1}>
        <Button
          variant="text"
          onClick={handleToggleMultiSelect}
          sx={{
            border: 'none',
            color: 'black',
            backgroundColor: 'transparent',
            textTransform: 'none',
          }}
        >
          {isMultiSelect ? 'Cancel Multiple Selection' : 'Select Multiple Sources'}
        </Button>
      </Box>

      {/* RENDER ALL GROUPS */}
      {groups.map((group) => renderSection(group.title, group.items))}

      {/* If in multi-select mode, show one Insert button at the very bottom */}
      {isMultiSelect && (
        <Box mt={2}>
          <Button variant="contained" onClick={handleInsertSelectedSources}>
            Insert ({selectedSources.length})
          </Button>
        </Box>
      )}
    </Collapse>
  );
};

export default SourceBreakdown;
