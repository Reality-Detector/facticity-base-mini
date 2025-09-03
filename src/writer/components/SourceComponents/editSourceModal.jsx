// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Box,
//   Chip,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel
// } from '@mui/material';

// export default function EditSourceModal({ open, onClose, source, onSave }) {
//   // Local state to hold all editable data
//   const [editData, setEditData] = useState({
//     // Common fields
//     authors: [],
//     source_type: 'Web Source', // default
//     annotation: '',

//     // "Web Source" fields
//     title: '',
//     website: '',
//     url: '',
//     year: '',
//     // Additional example fields:
//     datePublished: '',
//     dateAccessedViewed: '',

//     // "Journal Article" fields
//     titleOfArticle: '',
//     nameOfJournal: '',
//     volumeNumber: '',
//     issueNumber: '',
//     pageRange: '',
//     libraryDatabaseName: '',
//     doi: '',
//     // You can add 'year' here too, if you want a separate or shared field.
//   });

//   // Additional local state for adding new authors
//   const [newAuthor, setNewAuthor] = useState('');

//   // Reset form each time modal opens, pulling data from parent "source"
//   useEffect(() => {
//     if (open && source) {
//       setEditData({
//         // Common fields
//         authors: source.metadata.authors || [],
//         source_type: source.metadata.source_type || 'Web Source',
//         annotation: source.metadata.annotation || '',

//         // "Web Source" fields
//         title: source.metadata.title || '',
//         website: source.metadata.website || '',
//         url: source.metadata.url || '',
//         year: source.metadata.year || '',
//         datePublished: source.metadata.datePublished || '',
//         dateAccessedViewed: source.metadata.dateAccessedViewed || '',

//         // "Journal Article" fields
//         titleOfArticle: source.metadata.titleOfArticle || '',
//         nameOfJournal: source.metadata.nameOfJournal || '',
//         volumeNumber: source.metadata.volumeNumber || '',
//         issueNumber: source.metadata.issueNumber || '',
//         pageRange: source.metadata.pageRange || '',
//         libraryDatabaseName: source.metadata.libraryDatabaseName || '',
//         doi: source.metadata.doi || '',
//       });
//       setNewAuthor('');
//     }
//   }, [open, source]);

//   // Generic change handler
//   const handleChange = (e) => {
//     setEditData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // Handle adding a new author
//   const handleAddAuthor = () => {
//     if (!newAuthor.trim()) return;
//     setEditData((prev) => ({
//       ...prev,
//       authors: [...prev.authors, newAuthor.trim()],
//     }));
//     setNewAuthor('');
//   };

//   // Remove author by index
//   const handleDeleteAuthor = (indexToDelete) => {
//     setEditData((prev) => ({
//       ...prev,
//       authors: prev.authors.filter((_, idx) => idx !== indexToDelete),
//     }));
//   };

//   // For "Enter" key in the Add Author text field
//   const handleAuthorKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleAddAuthor();
//     }
//   };

//   // Final Save
//   const handleSave = () => {
//     // Pass updated data back to parent
//     onSave(editData);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Edit Source</DialogTitle>

//       <DialogContent>
//         <Box display="flex" flexDirection="column" gap={2} mt={1}>

//           {/* Source Type (Web Source or Journal Article) */}
//           <FormControl fullWidth>
//             <InputLabel id="source-type-label">Type of Source</InputLabel>
//             <Select
//               labelId="source-type-label"
//               label="Type of Source"
//               name="source_type"
//               value={editData.source_type}
//               onChange={handleChange}
//             >
//               <MenuItem value="Web Source">Web Source</MenuItem>
//               <MenuItem value="Journal Article">Journal Article</MenuItem>
//             </Select>
//           </FormControl>

//           {/* Authors Section */}
//           <Box>
//             <Box sx={{ mb: 1 }}>
//               <strong>Authors:</strong>
//             </Box>
//             {/* Display existing authors as Chips */}
//             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
//               {editData.authors.map((author, index) => (
//                 <Chip
//                   key={index}
//                   label={author}
//                   onDelete={() => handleDeleteAuthor(index)}
//                   color="primary"
//                   variant="outlined"
//                 />
//               ))}
//             </Box>

//             {/* Add new author */}
//             <Box sx={{ display: 'flex', gap: 1 }}>
//               <TextField
//                 label="Add Author"
//                 name="newAuthor"
//                 value={newAuthor}
//                 onChange={(e) => setNewAuthor(e.target.value)}
//                 onKeyDown={handleAuthorKeyDown}
//                 size="small"
//               />
//               <Button
//                 variant="contained"
//                 onClick={handleAddAuthor}
//                 sx={{ whiteSpace: 'nowrap' }}
//               >
//                 Add
//               </Button>
//             </Box>
//           </Box>

//           {/* Conditionally render fields depending on source_type */}
//           {editData.source_type === 'Web Source' && (
//             <>
//               <TextField
//                 label="Title"
//                 name="title"
//                 value={editData.title}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Website"
//                 name="website"
//                 value={editData.website}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="URL"
//                 name="url"
//                 value={editData.url}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Year"
//                 name="year"
//                 value={editData.year}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Date Published"
//                 name="datePublished"
//                 value={editData.datePublished}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Date Accessed/Viewed"
//                 name="dateAccessedViewed"
//                 value={editData.dateAccessedViewed}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Annotation"
//                 name="annotation"
//                 value={editData.annotation}
//                 onChange={handleChange}
//                 fullWidth
//                 multiline
//               />
//             </>
//           )}

//           {editData.source_type === 'Journal Article' && (
//             <>
//               <TextField
//                 label="Title of Article"
//                 name="titleOfArticle"
//                 value={editData.titleOfArticle}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Name of Journal"
//                 name="nameOfJournal"
//                 value={editData.nameOfJournal}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Volume Number"
//                 name="volumeNumber"
//                 value={editData.volumeNumber}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Issue Number"
//                 name="issueNumber"
//                 value={editData.issueNumber}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Page Range"
//                 name="pageRange"
//                 value={editData.pageRange}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Library Database Name"
//                 name="libraryDatabaseName"
//                 value={editData.libraryDatabaseName}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="DOI"
//                 name="doi"
//                 value={editData.doi}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="URL"
//                 name="url"
//                 value={editData.url}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Date Published"
//                 name="datePublished"
//                 value={editData.datePublished}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Date Accessed/Viewed"
//                 name="dateAccessedViewed"
//                 value={editData.dateAccessedViewed}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="Annotation"
//                 name="annotation"
//                 value={editData.annotation}
//                 onChange={handleChange}
//                 fullWidth
//                 multiline
//               />
//             </>
//           )}

//         </Box>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose} color="inherit">
//           Cancel
//         </Button>
//         <Button onClick={handleSave} variant="contained">
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }



import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../AppContext'; // Bring in the context
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';

export default function EditSourceModal({
  open,
  onClose,
  metadata,
  onSave,       // Optional custom save handler
  editIndex,    // Optional index if we want to know which reference is being edited
}) {
  // Access global reference array if we want "default" update logic
  const { referenceArray, setReferenceArray } = useContext(AppContext);

  // Local state to hold all editable data
  const [editData, setEditData] = useState({
    // Common fields
    authors: [],
    source_type: 'Web Source', // default
    annotation: '',

    // "Web Source" fields
    title: '',
    website: '',
    url: '',
    year: '',
    datePublished: '',
    dateAccessedViewed: '',

    // "Journal Article" fields
    titleOfArticle: '',
    nameOfJournal: '',
    volumeNumber: '',
    issueNumber: '',
    pageRange: '',
    libraryDatabaseName: '',
    doi: '',
  });

  // Additional local state for adding new authors
  const [newAuthor, setNewAuthor] = useState('');

  // Reset form each time modal opens, pulling data from parent "source"
  useEffect(() => {
    if (open && metadata) {
      setEditData({
        // Common fields
        authors: metadata?.authors || [],
        source_type: metadata?.source_type || 'Web Source',
        annotation: metadata?.annotation || '',

        // "Web Source" fields
        title: metadata?.title || '',
        website: metadata?.website || '',
        url: metadata?.url || '',
        year: metadata?.year || '',
        datePublished: metadata?.datePublished || '',
        dateAccessedViewed: metadata?.dateAccessedViewed || '',

        // "Journal Article" fields
        titleOfArticle: metadata?.titleOfArticle || '',
        nameOfJournal: metadata?.nameOfJournal || '',
        volumeNumber: metadata?.volumeNumber || '',
        issueNumber: metadata?.issueNumber || '',
        pageRange: metadata?.pageRange || '',
        libraryDatabaseName: metadata?.libraryDatabaseName || '',
        doi: metadata?.doi || '',
      });
      setNewAuthor('');
    }
  }, [open, metadata]);

  // Generic change handler
  const handleChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle adding a new author
  const handleAddAuthor = () => {
    if (!newAuthor.trim()) return;
    setEditData((prev) => ({
      ...prev,
      authors: [...prev.authors, newAuthor.trim()],
    }));
    setNewAuthor('');
  };

  // Remove author by index
  const handleDeleteAuthor = (indexToDelete) => {
    setEditData((prev) => ({
      ...prev,
      authors: prev.authors.filter((_, idx) => idx !== indexToDelete),
    }));
  };

  // For "Enter" key in the Add Author text field
  const handleAuthorKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAuthor();
    }
  };

  // Final Save
  const handleSave = () => {
    // If parent provided an onSave, use it:
    if (typeof onSave === 'function') {
      onSave(editData);
    } else {
      // Otherwise, do "default" behavior to update referenceArray in context
      if (editIndex != null) {
        // Update existing reference
        const updated = [...referenceArray];
        updated[editIndex] = {
          ...updated[editIndex],
          metadata: editData,
        };
        setReferenceArray(updated);
      } else {
        // Or create a new reference (if you allow new ones via this modal)
        setReferenceArray([...referenceArray, { metadata: editData }]);
      }
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Source</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>

          {/* Source Type (Web Source or Journal Article) */}
          <FormControl fullWidth>
            <InputLabel id="source-type-label">Type of Source</InputLabel>
            <Select
              labelId="source-type-label"
              label="Type of Source"
              name="source_type"
              value={editData.source_type}
              onChange={handleChange}
            >
              <MenuItem value="Web Source">Web Source</MenuItem>
              <MenuItem value="Journal Article">Journal Article</MenuItem>
            </Select>
          </FormControl>

          {/* Authors Section */}
          <Box>
            <Box sx={{ mb: 1 }}>
              <strong>Authors:</strong>
            </Box>
            {/* Display existing authors as Chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {editData.authors.map((author, index) => (
                <Chip
                  key={index}
                  label={author}
                  onDelete={() => handleDeleteAuthor(index)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>

            {/* Add new author */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Add Author"
                name="newAuthor"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                onKeyDown={handleAuthorKeyDown}
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleAddAuthor}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Add
              </Button>
            </Box>
          </Box>

          {/* Conditionally render fields depending on source_type */}
          {editData.source_type === 'Web Source' && (
            <>
              <TextField
                label="Title"
                name="title"
                value={editData.title}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Website"
                name="website"
                value={editData.website}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="URL"
                name="url"
                value={editData.url}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Year"
                name="year"
                value={editData.year}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Date Published"
                name="datePublished"
                value={editData.datePublished}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Date Accessed/Viewed"
                name="dateAccessedViewed"
                value={editData.dateAccessedViewed}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Annotation"
                name="annotation"
                value={editData.annotation}
                onChange={handleChange}
                fullWidth
                multiline
              />
            </>
          )}

          {editData.source_type === 'Journal Article' && (
            <>
              <TextField
                label="Title of Article"
                name="titleOfArticle"
                value={editData.titleOfArticle}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Name of Journal"
                name="nameOfJournal"
                value={editData.nameOfJournal}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Volume Number"
                name="volumeNumber"
                value={editData.volumeNumber}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Issue Number"
                name="issueNumber"
                value={editData.issueNumber}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Page Range"
                name="pageRange"
                value={editData.pageRange}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Library Database Name"
                name="libraryDatabaseName"
                value={editData.libraryDatabaseName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="DOI"
                name="doi"
                value={editData.doi}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="URL"
                name="url"
                value={editData.url}
                onChange={handleChange}
                fullWidth
              />
              {/* <TextField
                label="Date Published"
                name="datePublished"
                value={editData.datePublished}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Date Accessed/Viewed"
                name="dateAccessedViewed"
                value={editData.dateAccessedViewed}
                onChange={handleChange}
                fullWidth
              /> */}
              <TextField
                label="Year"
                name="year"
                value={editData.year}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Annotation"
                name="annotation"
                value={editData.annotation}
                onChange={handleChange}
                fullWidth
                multiline
              />
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
