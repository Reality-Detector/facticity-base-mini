import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../../AppProvider';

// const backendUrl = 'http://localhost:5000';

function PodcastEmbed({ podcastLink, height }) {
  const [podcastDetail, setPodcastDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  const { claimsRecieved, seekto, seektrigger, backendUrl} = useAppContext();

  useEffect(() => {
    const fetchPodcastDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/get-podcast-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ podcastUrl: podcastLink }),
        });

        const result = await response.json();
        if (response.ok && result.podcastDetail) {
          setPodcastDetail(result.podcastDetail);
        } else {
          setError(result.error || 'Podcast details are incomplete.');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching podcast details.');
      }
      setLoading(false);
    };

    if (claimsRecieved) {
      fetchPodcastDetails();
    }
  }, [podcastLink, claimsRecieved]);

  // Function to set the current time of the audio element
  const seekToPart = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  };

  // When seekto or seektrigger changes, call seekToPart
  useEffect(() => {
    if (seekto !== undefined) {
      console.log("Seeking to:", seekto);
      seekToPart(seekto);
    }
  }, [seekto, seektrigger]);

  if (loading)
    return <div style={{ fontFamily: 'Arial, sans-serif' }}>Loading podcast details...</div>;
  if (error)
    return <div style={{ fontFamily: 'Arial, sans-serif' }}>Error: {error}</div>;
  if (!podcastDetail?.enclosureUrl)
    return <div style={{ fontFamily: 'Arial, sans-serif' }}>No streaming URL available.</div>;

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        border: '1px solid #ccc',
        borderRadius: '12px',
        padding: '1rem',
        backgroundColor: '#f9f9f9',
        maxHeight: height || '30vh',
        overflowY: 'auto'
      }}
    >
      {/* Image and Title Row */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}
      >
        {podcastDetail.image && (
          <img
            src={podcastDetail.image}
            alt="Podcast cover"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '10px',
              objectFit: 'cover',
              flexShrink: 0
            }}
          />
        )}
        {podcastDetail.title && (
          <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#333', margin: 0 }}>
            {podcastDetail.title}
          </p>
        )}
      </div>

      {/* Audio Player Row */}
      <audio ref={audioRef} controls style={{ width: '100%' }}>
        <source src={podcastDetail.enclosureUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default PodcastEmbed;
