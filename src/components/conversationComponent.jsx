import React, { useEffect, useState } from 'react';
import { ListItemButton, ListItemText, Chip } from '@mui/material';
import { getYoutubeVideoDetails } from '../getyoutubetitle';

const ConversationItem = ({ conversation, currentConversation, handleConversationSelect, conversationItemStyle }) => {
  const [videoDetails, setVideoDetails] = useState(null);
  const [isYouTube, setIsYouTube] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const details = await getYoutubeVideoDetails(conversation.query);
        setVideoDetails(details);
        setIsYouTube(true);
      } catch (err) {
        setIsYouTube(false);
        // Optionally handle the error, e.g., log it or set an error state
        console.error(err);
      }
    };

    // Check if the query is a YouTube URL by attempting to extract the video ID
    const videoID = extractVideoID(conversation.query);
    if (videoID) {
      fetchVideoDetails();
    }
  }, [conversation.query]);

  // Reuse the extractVideoID function from getYoutubeVideoDetails
  const extractVideoID = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <ListItemButton
      key={conversation.id}
      selected={conversation.id === currentConversation}
      onClick={() => handleConversationSelect(conversation)}
      sx={conversationItemStyle}
    >
      {isYouTube && videoDetails ? (
        <>
          <ListItemText primary={videoDetails.title.slice(0,20)+"..."} />
          <Chip label="video" style={{ backgroundColor: '#FF3B30', color: 'white', marginRight: '8px', marginBottom: '8px' }} size="small" />
        </>
      ) : (
        <ListItemText primary={conversation.query.slice(0,40)} />
      )}
      {error && (
        <ListItemText primary="Invalid YouTube URL" secondary={error.message} />
      )}
    </ListItemButton>
  );
};

export default ConversationItem;
