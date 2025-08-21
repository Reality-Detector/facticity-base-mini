import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { marked } from 'marked';
const FactDetailsModal = ({ open, onClose, fact }) => {
  if (!fact) return null; // Return nothing if no fact is passed
    console.log(fact)
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Fact Details</DialogTitle>
      <DialogContent>
        <Typography
          variant="body2"
          sx={{ color: fact.Classification === 'False' ? 'error.main' : 'text.primary' }}
        >
          {fact.Classification}
        </Typography>
        <Typography
              variant="body2"
              dangerouslySetInnerHTML={{
                __html: fact.overall_assessment ? marked(fact.overall_assessment) : 'Query failed. Please try again'
              }}
              style={{ fontFamily: 'Helvetica', fontSize: '13px' }}
            />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FactDetailsModal;
// import React from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
// import { marked } from 'marked';

// // 1) Create a custom renderer to force links to have target="_blank".
// const renderer = new marked.Renderer();
// renderer.link = function (href, title, text) {
//   // `rel="noopener noreferrer"` is recommended for security reasons
//   return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`;
// };

// const FactDetailsModal = ({ open, onClose, fact }) => {
//   if (!fact) return null;

//   // 2) Use the custom renderer with marked
//   const htmlContent = fact.overall_assessment
//     ? marked(fact.overall_assessment, { renderer })
//     : 'Query failed. Please try again';

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Fact Details</DialogTitle>
//       <DialogContent>
//         <Typography
//           variant="body2"
//           sx={{ color: fact.Classification === 'False' ? 'error.main' : 'text.primary' }}
//         >
//           {fact.Classification}
//         </Typography>

//         <Typography
//           variant="body2"
//           dangerouslySetInnerHTML={{ __html: htmlContent }}
//           style={{ fontFamily: 'Helvetica', fontSize: '13px' }}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default FactDetailsModal;
