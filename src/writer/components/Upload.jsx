// // import React, { useState, useRef, useEffect, useContext } from 'react';
// // import IconButton from '@mui/material/IconButton';
// // import { AppContext } from './AppContext';

// // import {
// //   Box,
// //   Button,
// //   Modal,
// //   Typography,
// //   CircularProgress,
// //   TextField,
// // } from '@mui/material';

// // import {
// //   Upload as UploadIcon,
// //   Check as CheckIcon,
// //   Close as CloseIcon,
// //   Error as ErrorIcon,
// //   History as HistoryIcon,
// //   Search as SearchIcon,
// //   MenuBook as MenuBookIcon,
// //   Help as HelpIcon
// // } from '@mui/icons-material';

// // const style = {
// //   position: 'absolute',
// //   top: '50%',
// //   left: '50%',
// //   transform: 'translate(-50%, -50%)',
// //   width: 400,
// //   bgcolor: 'background.paper',
// //   boxShadow: 24,
// //   p: 4,
// //   textAlign: 'center',
// //   borderRadius: '8px',
// // };

// // const UploadToPinecone = ({currentProject, showToast}) => {
// //   const [open, setOpen] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [file, setFile] = useState(null);
// //   const [name, setName] = useState('');
// //   const [indexName, setIndexName] = useState('pdf-embeddings-v2');
// //   const fileInputRef = useRef(null);

// //   const handleOpen = () => setOpen(true);
// //   const handleClose = () => setOpen(false);

// //   const url = "https://backend-word-testing-934923488639.us-central1.run.app"
// //   // const url = "http://localhost:5000"

// //   const {email, setFiles, filesObj, setFilesObj} = useContext(AppContext);

// //   const handleDrop = (event) => {
// //     event.preventDefault();
// //     setFile(event.dataTransfer.files[0]);
// //   };

// //   const handleDragOver = (event) => {
// //     event.preventDefault();
// //   };

// //   const handleClick = () => {
// //     fileInputRef.current.click();
// //   };

// //   const handleFileChange = (event) => {
// //     setFile(event.target.files[0]);
// //   };

// //   const handleUpload = async () => {
// //     console.log("Uploading")
// //     console.log("AAA")
// //     console.log({email})
// //     console.log(file,email,name,currentProject)
// //     if (file && email && name && currentProject) {
// //       console.log("YES")
// //       setLoading(true);

// //       const formData = new FormData();
// //       formData.append('username', email);
// //       formData.append('file', file);
// //       formData.append('name', name);
// //       formData.append('project', currentProject);
// //       formData.append('index_name', indexName);

// //       try {
// //         const response = await fetch(url + '/upload', {
// //           method: 'POST',
// //           body: formData,
// //         });
      
// //         // Log the response object to see what it contains
// //         console.log(response);
      
// //         // Check if the response was successful
// //         if (response.ok) {
// //           // Read the response body as JSON
// //           const data = await response.json();
// //           console.log(data); // log the data to check the response

// //           setLoading(false);

// //           setFiles(data.files)

// //           const updatedFilesObj = filesObj.map(project => 
// //             project.project === currentProject 
// //               ? { ...project, files: data.files } // Update the matching project with new files
// //               : project // Keep the other projects as they are
// //           );
          
// //           setFilesObj(updatedFilesObj);

// //           handleClose();
// //           showToast('Document Uploaded Successfully');
// //         } 
// //       } catch (error) {
// //         console.error('Error uploading file:', error);
// //       } 
// //     } else {
// //       alert('Please provide all the required fields and select a file.');
// //     }
// //   };

// //   return (
// //     <div>
// //       <IconButton onClick={handleOpen} sx={{ mb: 1 }}>
// //         <UploadIcon fontSize="small" />
// //       </IconButton>

// //       <Modal open={open} onClose={handleClose} aria-labelledby="upload-modal">
// //         <Box sx={style}>
// //           <Typography variant="h6" component="h2" gutterBottom>
// //             Drag & Drop Your Document Here
// //           </Typography>

// //           <Box
// //             onDrop={handleDrop}
// //             onDragOver={handleDragOver}
// //             onClick={handleClick}
// //             sx={{
// //               border: '2px dashed #ccc',
// //               borderRadius: '8px',
// //               padding: '20px',
// //               backgroundColor: '#f9f9f9',
// //               cursor: 'pointer',
// //               height: '150px',
// //               display: 'flex',
// //               justifyContent: 'center',
// //               alignItems: 'center',
// //               marginBottom: '16px',
// //             }}
// //           >
// //             {file ? (
// //               <Typography variant="body2">{file.name}</Typography>
// //             ) : (
// //               <Typography variant="body2">Drag & Drop Here or Click to Upload</Typography>
// //             )}
// //             <input
// //               type="file"
// //               ref={fileInputRef}
// //               style={{ display: 'none' }}
// //               onChange={handleFileChange}
// //             />
// //           </Box>
// //           <TextField
// //             label="Name"
// //             variant="outlined"
// //             fullWidth
// //             margin="normal"
// //             value={name}
// //             onChange={(e) => setName(e.target.value)}
// //           />
// //           <Button
// //             variant="contained"
// //             color="primary"
// //             onClick={handleUpload}
// //             disabled={!file || loading}
// //             fullWidth
// //             sx={{ marginTop: '16px' }}
// //           >
// //             {loading ? (
// //               <>
// //                 <CircularProgress size={24} color="inherit" sx={{ marginRight: '8px' }} />
// //                 Uploading...
// //               </>
// //             ) : (
// //               'Upload'
// //             )}
// //           </Button>
// //         </Box>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default UploadToPinecone;


// import React, { useState, useRef, useContext } from 'react';
// import IconButton from '@mui/material/IconButton';
// import { AppContext } from './AppContext';

// import {
//   Box,
//   Button,
//   Modal,
//   Typography,
//   CircularProgress,
//   TextField,
// } from '@mui/material';

// import {
//   Upload as UploadIcon,
// } from '@mui/icons-material';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
//   textAlign: 'center',
//   borderRadius: '8px',
// };

// const UploadToPinecone = ({ currentProject, showToast }) => {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(null);
//   const [name, setName] = useState('');
//   const [indexName, setIndexName] = useState('pdf-embeddings-v2');
//   const [fileError, setFileError] = useState(false);
//   const [nameError, setNameError] = useState(false);
//   const [currentProjectError, setCurrentProjectError] = useState(false);
//   const [emailError, setEmailError] = useState(false);

//   const fileInputRef = useRef(null);
//   const { email, setFiles, filesObj, setFilesObj } = useContext(AppContext);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const url = "https://backend-word-testing-934923488639.us-central1.run.app";
//   // const url = "http://localhost:5000";

//   const handleDrop = (event) => {
//     event.preventDefault();
//     setFile(event.dataTransfer.files[0]);
//     setFileError(false);
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };

//   const handleClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//     setFileError(false);
//   };

//   const handleUpload = async () => {
//     let hasError = false;
//     if (!file) {
//       setFileError(true);
//       hasError = true;
//     }
//     if (!name) {
//       setNameError(true);
//       hasError = true;
//     }
//     if (!currentProject) {
//       setCurrentProjectError(true);
//       hasError = true;
//     }
//     if (!email) {
//       setEmailError(true);
//       hasError = true;
//     }

//     if (hasError) {
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append('username', email);
//     formData.append('file', file);
//     formData.append('name', name);
//     formData.append('project', currentProject);
//     formData.append('index_name', indexName);

//     try {
//       const response = await fetch(url + '/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();

//         setLoading(false);
//         setFiles(data.files);

//         const updatedFilesObj = filesObj.map(project =>
//           project.project === currentProject
//             ? { ...project, files: data.files }
//             : project
//         );

//         setFilesObj(updatedFilesObj);

//         handleClose();
//         showToast('Document Uploaded Successfully');
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   return (
//     <div>
//       <IconButton onClick={handleOpen} sx={{ mb: 1 }}>
//         <UploadIcon fontSize="small" />
//       </IconButton>

//       <Modal open={open} onClose={handleClose} aria-labelledby="upload-modal">
//         <Box sx={style}>
//           <Typography variant="h6" component="h2" gutterBottom>
//             Drag & Drop Your Document Here
//           </Typography>

//           <Box
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             onClick={handleClick}
//             sx={{
//               border: '2px dashed #ccc',
//               borderRadius: '8px',
//               padding: '20px',
//               backgroundColor: '#f9f9f9',
//               cursor: 'pointer',
//               height: '150px',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginBottom: '16px',
//             }}
//           >
//             {file ? (
//               <Typography variant="body2">{file.name}</Typography>
//             ) : (
//               <Typography variant="body2">Drag & Drop Here or Click to Upload</Typography>
//             )}
//             <input
//               type="file"
//               ref={fileInputRef}
//               style={{ display: 'none' }}
//               onChange={handleFileChange}
//             />
//           </Box>
//           {fileError && <Typography color="error">Please select a file.</Typography>}
          
//           <TextField
//             label="Name"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={name}
//             onChange={(e) => {
//               setName(e.target.value);
//               setNameError(false);
//             }}
//             error={nameError}
//             helperText={nameError ? 'Please enter a name.' : ''}
//           />

//           {currentProjectError && <Typography color="error">No current project selected.</Typography>}
//           {emailError && <Typography color="error">Email is missing, please log in again.</Typography>}

//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleUpload}
//             disabled={!file || loading}
//             fullWidth
//             sx={{ marginTop: '16px' }}
//           >
//             {loading ? (
//               <>
//                 <CircularProgress size={24} color="inherit" sx={{ marginRight: '8px' }} />
//                 Uploading...
//               </>
//             ) : (
//               'Upload'
//             )}
//           </Button>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default UploadToPinecone;


import React, { useState, useRef, useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import { AppContext } from './AppContext';

import {
  Box,
  Button,
  Modal,
  Typography,
  CircularProgress,
  TextField,
} from '@mui/material';

import {
  Upload as UploadIcon,
} from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
  borderRadius: '8px',
};

const UploadToPinecone = ({ currentProject, showToast, setIsExpanded}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [indexName, setIndexName] = useState('pdf-embeddings-v2');
  const [fileError, setFileError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [currentProjectError, setCurrentProjectError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [missingFieldsMessage, setMissingFieldsMessage] = useState('');

  const fileInputRef = useRef(null);
  const { email, setFiles, filesObj, setFilesObj, files} = useContext(AppContext);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const url = "https://backend-word-testing-934923488639.us-central1.run.app";
  // const url = "http://localhost:5000";

  const handleDrop = (event) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
    setFileError(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileError(false);
  };

  // const handleUpload = async () => {
  //   let missingFields = [];

  //   if (!file) {
  //     setFileError(true);
  //     missingFields.push('File');
  //   }

  //   if (!name) {
  //     setNameError(true);
  //     missingFields.push('Name');
  //   }

  //   if (!currentProject) {
  //     setCurrentProjectError(true);
  //     missingFields.push('Current Project');
  //   }

  //   if (!email) {
  //     setEmailError(true);
  //     missingFields.push('Email');
  //   }

  //   if (missingFields.length > 0) {
  //     setMissingFieldsMessage(`Missing: ${missingFields.join(', ')}`);
  //     return;
  //   } else {
  //     setMissingFieldsMessage('');
  //   }

  //   setLoading(true);

  //   const formData = new FormData();
  //   formData.append('username', email);
  //   formData.append('file', file);
  //   formData.append('name', name);
  //   formData.append('project', currentProject);
  //   formData.append('index_name', indexName);

  //   try {
  //     const response = await fetch(url + '/upload', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       const data = await response.json();

  //       setLoading(false);
  //       setFiles(data.files);

  //       const updatedFilesObj = filesObj.map(project =>
  //         project.project === currentProject
  //           ? { ...project, files: data.files }
  //           : project
  //       );

  //       setFilesObj(updatedFilesObj);

  //       handleClose();
  //       showToast('Document Uploaded Successfully');
  //     }
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //   }
  // };

  const handleUpload = async () => {
    let missingFields = [];
  
    if (!file) {
      setFileError(true);
      missingFields.push('File');
    }
  
    if (!name) {
      setNameError(true);
      missingFields.push('Name');
    }
  
    if (!currentProject) {
      setCurrentProjectError(true);
      missingFields.push('Current Project');
    }
  
    if (!email) {
      setEmailError(true);
      missingFields.push('Email');
    }
  
    if (missingFields.length > 0) {
      setMissingFieldsMessage(`Missing: ${missingFields.join(', ')}`);
      return;
    } else {
      setMissingFieldsMessage('');
    }
  
    // Check if file with the same name already exists in the project
    const fileName = `${name}_${email}_${currentProject}`;
    const existingFile = files.find(f => f === fileName);
  
    if (existingFile) {
      setMissingFieldsMessage('Error: File name already exists in the project.');
      return; // Stop the upload process
    }
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append('username', email);
    formData.append('file', file);
    formData.append('name', name);
    formData.append('project', currentProject);
    formData.append('index_name', indexName);
  
    try {
      const response = await fetch(url + '/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
  
        setLoading(false);
        setFiles(data.files);
  
        const updatedFilesObj = filesObj.map(project =>
          project.project === currentProject
            ? { ...project, files: data.files }
            : project
        );
  
        setFilesObj(updatedFilesObj);
        setIsExpanded(true)
        handleClose();
        showToast('Document Uploaded Successfully');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpen} sx={{ mb: 1 }}>
        <UploadIcon fontSize="small" />
      </IconButton>

      <Modal open={open} onClose={handleClose} aria-labelledby="upload-modal">
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Drag & Drop Your Document Here
          </Typography>

          <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClick}
            sx={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#f9f9f9',
              cursor: 'pointer',
              height: '150px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            {file ? (
              <Typography variant="body2">{file.name}</Typography>
            ) : (
              <Typography variant="body2">Drag & Drop Here or Click to Upload</Typography>
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Box>
          {fileError && <Typography color="error">Please select a file.</Typography>}
          
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(false);
            }}
            error={nameError}
            helperText={nameError ? 'Please enter a name.' : ''}
          />

          {currentProjectError && <Typography color="error">Please select a project or create one to upload a file.</Typography>}
          {emailError && <Typography color="error">Email is missing, please log in again.</Typography>}

          {/* Display missing fields message */}
          {missingFieldsMessage && (
            <Typography color="error" sx={{ marginBottom: '16px' }}>
              {missingFieldsMessage}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={loading}
            fullWidth
            sx={{ marginTop: '16px' }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ marginRight: '8px' }} />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UploadToPinecone;
