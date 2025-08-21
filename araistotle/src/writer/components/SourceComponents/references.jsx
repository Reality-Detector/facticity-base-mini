// import React, { useContext, useState } from 'react';
// import { AppContext } from '../AppContext';
// import {
//   Grid,
//   Card,
//   CardHeader,
//   CardContent,
//   CardActions,
//   Typography,
//   Button,
//   IconButton
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';

// import EditSourceModal from './editSourceModal';

// const ReferenceList = ({ addReferences }) => {
//   const { referenceArray, setReferenceArray } = useContext(AppContext);

//   // Modal state
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editSource, setEditSource] = useState(null);

//   // ---------------------
//   //    HANDLER METHODS
//   // ---------------------

//   // Open the EditSourceModal
//   const handleOpenEdit = (index) => {
//     console.log({referenceArray})
//     setEditIndex(index);
//     setEditSource(referenceArray[index]);
//     setOpenEditModal(true);
//   };

//   // Close the modal
//   const handleCloseEdit = () => {
//     setOpenEditModal(false);
//     setEditIndex(null);
//     setEditSource(null);
//   };

//   // Handle deleting a reference
//   const handleDelete = (index) => {
//     const updatedArray = referenceArray.filter((_, i) => i !== index);
//     setReferenceArray(updatedArray);
//   };

//   // If you want to manually control what happens when saving:
//   // (If you DO pass `onSave` into <EditSourceModal />, it will call this.)
//   const handleSaveEdit = (updatedData) => {
//     const updated = [...referenceArray];
//     updated[editIndex] = updatedData
//     setReferenceArray(updated);
//     handleCloseEdit();
//   };

//   return (
//     <div style={{ padding: '1rem' }}>
//       <Grid container spacing={2}>
//         {referenceArray.map((ref, index) => (
//           <Grid item xs={12} md={6} lg={4} key={index}>
//             <Card
//               sx={{
//                 boxShadow: 3,
//                 borderRadius: 3,
//                 backgroundColor: '#f9f9f9',
//               }}
//             >
//               <CardHeader
//                 title={ref.title || `${ref.website}`}
//               />
//               <CardContent>
//                 {Object.entries(ref || {})
//                     .filter(([key, value]) => key !== "content" && value) // Exclude key "content" and empty values
//                     .map(([key, value]) => (
//                         <Typography
//                             variant="body2"
//                             key={key}
//                             sx={{ marginBottom: '0.5rem' }}
//                         >
//                             <strong>{key}:</strong> {value?.toString()}
//                         </Typography>
//                     ))}
//               </CardContent>
//               <CardActions>
//                 <IconButton
//                   color="primary"
//                   onClick={() => handleOpenEdit(index)}
//                 >
//                   <EditIcon />
//                 </IconButton>
//                 <IconButton
//                   color="error"
//                   onClick={() => handleDelete(index)}
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <div style={{ marginTop: '1.5rem' }}>
//         <Button variant="contained" onClick={addReferences}>
//           Add References
//         </Button>
//       </div>

//       {/* Reusable EditSourceModal */}
//       <EditSourceModal
//         open={openEditModal}
//         onClose={handleCloseEdit}
//         source={{metadata:editSource}}
//         // If you omit onSave entirely, EditSourceModal will do a default update using the context
//         // If you include it, you can manage the data yourself:
//         onSave={handleSaveEdit}
//       />
//     </div>
//   );
// };

// export default ReferenceList;


import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import {
  Box,
  Typography,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  Tooltip
} from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import Checkbox from '@mui/material/Checkbox'; // <--- Uncomment if you want the checkboxes back

import EditSourceModal from './editSourceModal';

const ReferenceList = ({ addReferences }) => {
  const { referenceArray, setReferenceArray } = useContext(AppContext);

  const [selectedStyle, setSelectedStyle] = useState('APA');
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editSource, setEditSource] = useState(null);

  // Change reference style
  const handleStyleChange = (event) => {
    setSelectedStyle(event.target.value);
  };

  // When opening to edit an existing source
  const handleOpenEdit = (index) => {
    setEditIndex(index);
    setEditSource(referenceArray[index] || {});
    setOpenEditModal(true);
  };

  // Close modal
  const handleCloseEdit = () => {
    setOpenEditModal(false);
    setEditIndex(null);
    setEditSource(null);
  };

  // Delete a reference
  const handleDelete = (index) => {
    const updatedArray = referenceArray.filter((_, i) => i !== index);
    setReferenceArray(updatedArray);
  };

  // Common save for both edit & new creation
  const handleSaveEdit = (updatedData) => {
    if (editIndex === null) {
      // Creating a new source
      setReferenceArray((prev) => [...prev, updatedData]);
    } else {
      // Updating an existing source
      const updated = [...referenceArray];
      updated[editIndex] = updatedData;
      setReferenceArray(updated);
    }
    handleCloseEdit();
  };

  // Insert references logic (if needed)
  const handleInsertReferences = () => {
    if (typeof addReferences === 'function') {
      addReferences();
    }
  };

  // "Upload Citation" => open modal in "create mode"
  const handleUploadCitation = () => {
    setEditIndex(null);      // Null means create a new entry
    setEditSource({});       // Blank object for new
    setOpenEditModal(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderRadius: 1,
        boxShadow: 2,
      }}
    >
      {/* Header Row: Citation + Style Selector */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          borderBottom: '1px solid #ccc',
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          Citation
        </Typography>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Style
        </Typography>
        <FormControl size="small">
          <Select
            value={selectedStyle}
            onChange={handleStyleChange}
            sx={{ height: 30 }}
          >
            <MenuItem value="APA">APA</MenuItem>
            {/* <MenuItem value="MLA">MLA</MenuItem>
            <MenuItem value="Chicago">Chicago</MenuItem> */}
          </Select>
        </FormControl>
      </Box>

      {/* Toolbar Row: "[X] Source", Filter, Search */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          borderBottom: '1px solid #ccc',
          flexShrink: 0,
        }}
      >
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {referenceArray.length} Source
        </Typography>
        {/* <Tooltip title="Filter">
          <IconButton size="small">
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Search">
          <IconButton size="small">
            <SearchIcon fontSize="small" />
          </IconButton>
        </Tooltip> */}
      </Box>

      {/* Reference List */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
        }}
      >
        <List dense>
          {referenceArray.map((ref, index) => {
            const { authors, title, website, url } = ref;
            console.log({ref})
            return (
              <ListItem
                key={index}
                sx={{
                  alignItems: 'flex-start',
                  padding: 1,
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                {/* 
                  // If you want the checkbox, uncomment:
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Checkbox
                      edge="start"
                      // checked={...}
                      // onChange={() => handleToggle(index)}
                      tabIndex={-1}
                      size="small"
                    />
                  </ListItemIcon> 
                */}

                <ListItemText
                  primary={
                    <Box>
                      {/* Authors */}
                      {Array.isArray(authors) ? (
                        <Typography variant="body2">
                          <strong>Authors:</strong> {authors.join(', ')}
                        </Typography>
                      ) : authors ? (
                        <Typography variant="body2">
                          <strong>Authors:</strong> {authors}
                        </Typography>
                      ) : (
                        <Typography variant="body2" sx={{ color: 'red' }}>
                          <strong>Authors:</strong> None
                        </Typography>
                      )}

                      {/* Title */}
                      {title && (
                        <Typography variant="body2">
                          <strong>Title:</strong> {title}
                        </Typography>
                      )}

                      {/* Link/Website (clickable) */}
                      {(url || website) && (
                        <Typography variant="body2">
                          <strong>Link:</strong>{' '}
                          <a
                            href={url || website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {url || website}
                          </a>
                        </Typography>
                      )}
                    </Box>
                  }
                />

                {/* Edit / Delete Actions */}
                <ListItemSecondaryAction>
                  <IconButton
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenEdit(index)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer Buttons */}
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
          p: 1,
          flexShrink: 0,
        }}
      >
        <Button variant="outlined" size="small" onClick={handleUploadCitation}>
          Upload Citation
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleInsertReferences}
        >
          Insert References
        </Button>
      </Box>

      {/* Edit / Create Modal */}
      <EditSourceModal
        open={openEditModal}
        onClose={handleCloseEdit}
        source={{ metadata: editSource }}
        onSave={handleSaveEdit}
      />
    </Box>
  );
};

export default ReferenceList;
