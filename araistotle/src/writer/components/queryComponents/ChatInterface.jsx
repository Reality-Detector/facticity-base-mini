import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Message from './Message';
import TypingIndicator from '../TypingIndicator';
import { queryAPI } from './services/apiService';
import useTypingIndicator from './hooks/useTypingIdicator';
import { useAppContext } from '../../../AppProvider';

const ChatInterface = ({ files, setConversation, conversation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState(conversation);
  const [isTyping, setIsTyping] = useState(false);
  const [fileSuggestions, setFileSuggestions] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [selectedFile, setSelectedFile] = useState(''); // To track the selected file
  const { accessToken } = useAppContext();
  const showTyping = useTypingIndicator(isTyping);
  const chatEndRef = useRef(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const userMessage = { sender: 'user', text: searchQuery };

    // Add user's message to local state and external conversation state
    setMessages((prev) => [...prev, userMessage]);
    setConversation((prev) => [...prev, userMessage]);

    setSearchQuery('');
    setSelectedFile('');
    setIsTyping(true);

    try {
      const response = await queryAPI(searchQuery, files, accessToken); // Wait for the API response
      console.log({ response });

      const botMessage = { sender: 'bot', text: response };

      // Add bot's message to local state and external conversation state
      setMessages((prev) => [...prev, botMessage]);
      setConversation((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' };

      // Add error message to local state and external conversation state
      setMessages((prev) => [...prev, errorMessage]);
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      // Only set isTyping to false once the API call completes (success or failure)
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Tab' && showAutocomplete && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      completeFileName();
    }
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Trigger autocomplete if "@" is typed
    if (value.includes('@')) {
      const queryAfterAt = value.split('@').pop().trim();
      if (queryAfterAt.length > 0) {
        const suggestions = files.filter((file) =>
          file.toLowerCase().includes(queryAfterAt.toLowerCase())
        );
        setFileSuggestions(suggestions);
        setShowAutocomplete(true);
      }
    } else {
      setShowAutocomplete(false);
    }
  };

  const completeFileName = () => {
    if (selectedSuggestionIndex >= 0 && fileSuggestions[selectedSuggestionIndex]) {
      const selectedFile = fileSuggestions[selectedSuggestionIndex].split('_')[0];
      const queryParts = searchQuery.split('@');
      queryParts.pop(); // Remove the part after the "@"
      const updatedQuery = `${queryParts.join('@')}@${selectedFile} `;
      setSearchQuery(updatedQuery);
      setSelectedFile(selectedFile); // Store the selected file to display
      setShowAutocomplete(false);
    }
  };

  const handleArrowNavigation = (e) => {
    if (showAutocomplete) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev + 1) % fileSuggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev === 0 ? fileSuggestions.length - 1 : prev - 1
        );
      }
    }
  };

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      maxWidth="600px"
      margin="auto"
      mt={5}
      p={1} // Reduce padding
      borderRadius={2}
      bgcolor="background.paper"
    >
      <Box
        flexGrow={1}
        overflow="auto"
        mb={1} // Smaller margin
        p={1} // Smaller padding
        sx={{ maxHeight: '60vh' }}
      >
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
        {showTyping && <Message sender="bot" text={<TypingIndicator />} />}
        <div ref={chatEndRef} />
      </Box>

      {showAutocomplete && fileSuggestions.length > 0 && (
        <Box sx={{ border: '1px solid gray', p: 1, maxHeight: '150px', overflowY: 'auto' }}>
          {fileSuggestions.map((file, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: selectedSuggestionIndex === index ? 'lightgray' : 'white',
                padding: '8px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setSelectedSuggestionIndex(index);
                completeFileName();
              }}
            >
              {file.split('_')[0]}
            </Box>
          ))}
        </Box>
      )}

      <Box display="flex" flexDirection="column" gap={1}>
        {/* Display underlined selected file above the input */}
        {selectedFile && (
          <Typography variant="body1" sx={{ textDecoration: 'underline', mb: 1 }}>
            @{selectedFile}
          </Typography>
        )}

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask anything about the documents..."
          value={searchQuery}
          onChange={handleQueryChange}
          onKeyDown={(e) => {
            handleKeyPress(e);
            handleArrowNavigation(e);
          }}
          InputProps={{ style: { fontSize: 12 } }} // Smaller font size
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          sx={{ fontSize: 12 }} // Smaller button font size
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInterface;
