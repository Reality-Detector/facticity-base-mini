import React from 'react';
import { Popover, Button, Box, Typography } from '@mui/material';

// Import your modal
import EditSourceModal from './editSourceModal';


const getDomain = (url) => {
  try {
      const { hostname } = new URL(url);
      return hostname;
  } catch (e) {
      console.error("Invalid URL:", url);
      return '';
  }
};


export default function ClickSourceLink({ key, metadata, updateData, index}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openEditModal, setOpenEditModal] = React.useState(false);

  // A reference format variable. In the future, you can easily extend
  // this to handle different formats (e.g., MLA, Chicago, etc.)
  const referenceFormat = 'APA';

  // Handle opening Popover on click
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing Popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Determine if the Popover should be open
  const open = Boolean(anchorEl);
  const id = open ? 'view-source-popover' : undefined;

  // Toggle edit modal
  const handleEditClick = () => {
    setOpenEditModal(true);
  };

  const handleEditClose = () => {
    setOpenEditModal(false);
  };

  // This function is called from EditSourceModal when the user clicks save
  const handleSaveEdit = (updatedData) => {
    console.log({ updatedData });
    console.log({index})
    updateData(index,updatedData);
    console.log('Saved Data from Modal:', updatedData);
  };

  // Destructure your metadata
  // const { url, authors = [], website, year, source_type } = source.metadata || {};
  const { url, authors = [], website, year, source_type } = metadata || {};

  // 1. Create a function that builds the reference string based on a format
  const getReferenceString = (format) => {
    switch (format) {
      case 'APA':
        // A simple example for an APA-style reference:
        //  1. Join multiple authors with ", " except for the last one which could be " & "
        //  2. (Year).
        //  3. Title or site name in italics (if you want)
        //  4. Additional info: source_type, URL, etc.

        // Combine authors with commas and " & " for last author
        let authorsStr = '';
        if (authors.length > 1) {
          const allButLast = authors.slice(0, -1).join(', ');
          const last = authors[authors.length - 1];
          authorsStr = `${allButLast} & ${last}`;
        } else if (authors.length === 1) {
          authorsStr = authors[0];
        }

        // If no authors, we might use website as fallback
        if (!authorsStr) {
          authorsStr = website;
        }

        // Example APA style: "Smith, J., & Doe, A. (2020). Website Title. Retrieved from https://..."
        // Adjust as needed for your data fields
        return `${authorsStr} (${year}). ${website}. [${source_type}]. Retrieved from ${url}`;

      default:
        // Fallback—just show something simple
        return `${website} (${year}) [${source_type}]`;
    }
  };

  // 2. Generate the reference string
  const referenceString = getReferenceString(referenceFormat);

  // const domain = getDomain(source.metadata.url);
  const domain = getDomain(metadata.url);
  const faviconUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}`
    : '';

  return (
    <>
      <Box
        aria-owns={open ? id : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          display: 'inline-block',
          cursor: 'pointer',
          textDecoration: 'none',
          color: 'primary.main',
          textAlign: 'left',
          fontFamily: 'Roboto, sans-serif',
          ':hover': {
            textDecoration: 'underline',
          },
        }}
      >
        {faviconUrl && (
            <img
                src={faviconUrl}
                style={{ width: '16px', height: '16px', marginRight: '6px' }}
            />
        )}
        {authors.length > 0 ? authors.join(', ') : website} {year} {source_type} 🔗
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            bgcolor: 'black', // Black background
            color: 'white',   // White text color
            padding: 2,       // Add padding for the popover content
            borderRadius: 2,  // Optional: Rounded corners
            textAlign: 'left',
            fontFamily: 'Roboto, sans-serif',
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          sx={{
            textAlign: 'left',
            alignItems: 'flex-start', // Ensures left alignment of all child elements
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {/* View Source Button */}
          <Button
            variant="text"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'primary.main',
              textTransform: 'none',
              fontWeight: 'bold',
              fontFamily: 'Roboto, sans-serif',
              ':hover': {
                textDecoration: 'underline',
              },
            }}
          >
            View Source 🔗
          </Button>

          {/* Source details in APA format */}
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.9rem',
              color: 'white',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            {referenceString.substring(0, 50) + '...'}
          </Typography>

          {/* Edit link */}
          <Box
            component="a"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleEditClick();
              handleClose();
            }}
            sx={{
              fontSize: '0.8rem',
              color: 'white',
              textDecoration: 'none',
              fontFamily: 'Roboto, sans-serif',
              ':hover': {
                textDecoration: 'underline',
              },
            }}
          >
            ✎ Edit
          </Box>
        </Box>
      </Popover>

      {/* Edit Modal */}
      <EditSourceModal
        open={openEditModal}
        onClose={handleEditClose}
        metadata={metadata}
        onSave={handleSaveEdit}
      />
    </>
  );
}
