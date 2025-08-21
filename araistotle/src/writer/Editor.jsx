// import React, { useRef, useContext, useEffect } from 'react';
// import { Box } from '@mui/material';
// import { AppContext } from './components/AppContext';

// function Editor({ editorRef, focusEditor }) {
//   const { text, setText } = useContext(AppContext);
//   const editorContentRef = useRef();

//   useEffect(() => {
//     if (editorRef.current && editorRef.current.innerText !== text) {
//       editorRef.current.innerText = text;
//     }
//   }, [text, editorRef]);

//   const handleInput = () => {
//     const selection = window.getSelection();
//     const range = selection.getRangeAt(0); // Save cursor position
//     const newText = editorRef.current.innerText;
//     setText(newText); // Update the state
//     editorContentRef.current = newText;

//     // Restore cursor position
//     setTimeout(() => {
//       if (editorRef.current) {
//         selection.removeAllRanges();
//         selection.addRange(range);
//       }
//     }, 0);
//   };

//   return (
//     <Box
//       ref={editorRef}
//       contentEditable
//       suppressContentEditableWarning
//       onClick={focusEditor}
//       onInput={handleInput}
//       sx={{
//         border: '1px solid #ccc',
//         minHeight: '70vh',
//         padding: '16px',
//         outline: 'none',
//         cursor: 'text',
//         borderRadius: '4px',
//         backgroundColor: '#fff',
//         overflowY: 'auto', // Allow vertical scrolling
//         maxHeight: '70vh', // Limit maximum height to 90% of the viewport height
//         height: 'auto', // Allow dynamic height based on content
//       }}
//     />
//   );
// }

// export default Editor;


import React, { useRef, useContext, useEffect } from 'react';
import { Box } from '@mui/material';
import { AppContext } from './components/AppContext';

function Editor({ editorRef, focusEditor }) {
  const { text, setText } = useContext(AppContext);
  const editorContentRef = useRef();

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== text) {
      editorRef.current.innerText = text;
    }
  }, [text, editorRef]);

  const handleInput = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0); // Save cursor position
    const newText = editorRef.current.innerText;
    setText(newText); // Update the state
    editorContentRef.current = newText;

    // Restore cursor position
    setTimeout(() => {
      if (editorRef.current) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }, 0);
  };

  const handlePaste = (e) => {
    e.preventDefault(); // Prevent the default paste behavior

    const plainText = e.clipboardData.getData('text/plain'); // Get plain text from the clipboard
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents(); // Remove current selection
      range.insertNode(document.createTextNode(plainText)); // Insert plain text
      selection.removeAllRanges();
      selection.addRange(range); // Restore the updated range
    }
  };

  return (
    <Box
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onClick={focusEditor}
      onInput={handleInput}
      onPaste={handlePaste} // Attach the onPaste handler
      sx={{
        border: '1px solid #ccc',
        minHeight: '70vh',
        padding: '16px',
        outline: 'none',
        cursor: 'text',
        borderRadius: '4px',
        backgroundColor: '#fff',
        overflowY: 'auto', // Allow vertical scrolling
        maxHeight: '70vh', // Limit maximum height to 90% of the viewport height
        height: 'auto', // Allow dynamic height based on content
      }}
    />
  );
}

export default Editor;
