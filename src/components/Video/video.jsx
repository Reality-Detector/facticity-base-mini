// import React from 'react';


// function extractVideoId(videoLink) {
//   let videoId = '';
//   if (videoLink.includes('youtube.com/shorts/')) {
//       videoId = videoLink.split('youtube.com/shorts/')[1].split('?')[0];
//   } else if (videoLink.includes('v=')) {
//       videoId = videoLink.split('v=')[1].split('&')[0];
//   } else if (videoLink.includes('youtu.be/')) {
//       videoId = videoLink.split('youtu.be/')[1].split('?')[0];
//   }
//   return videoId;
// }

// function YouTubeEmbed({ videoLink, height }) {
//   // Extract the YouTube video ID from the link
//   const videoId = extractVideoId(videoLink)

//   return (
//     <div style={{ height: height }}>
//       <iframe
//         width="100%"
//         height="100%"
//         src={`https://www.youtube.com/embed/${videoId}`}
//         frameBorder="0"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen
//         title="Embedded YouTube Video"
//       ></iframe>
//     </div>
//   );
// }

// export default YouTubeEmbed;


import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../AppProvider';


function extractVideoId(videoLink) {
  let videoId = '';
  if (videoLink.includes('youtube.com/shorts/')) {
      videoId = videoLink.split('youtube.com/shorts/')[1].split('?')[0];
  } else if (videoLink.includes('v=')) {
      videoId = videoLink.split('v=')[1].split('&')[0];
  } else if (videoLink.includes('youtu.be/')) {
      videoId = videoLink.split('youtu.be/')[1].split('?')[0];
  }
  return videoId;
}

function YouTubeEmbed({ videoLink, height }) {
  const videoId = extractVideoId(videoLink);
  const iframeRef = useRef(null);
  const [player, setPlayer] = useState(null);

  const { seekto, seektrigger } = useAppContext();


  useEffect(() => {
    console.log({seekto})
    seekToPart(seekto)
  }, [seekto, seektrigger]);


  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.onload = () => {
          if (window.YT && window.YT.Player) {
            initPlayer();
          } else {
            window.onYouTubeIframeAPIReady = initPlayer;
          }
        };
        document.body.appendChild(tag);
      } else {
        if (window.YT.Player) {
          initPlayer();
        } else {
          window.onYouTubeIframeAPIReady = initPlayer;
        }
      }
    };

    const initPlayer = () => {
      if (iframeRef.current && window.YT) {
        const newPlayer = new window.YT.Player(iframeRef.current, {
          events: {
            onReady: (event) => setPlayer(event.target),
          },
        });
      }
    };

    loadYouTubeAPI();
  }, [videoId]);

  const seekToPart = (seconds) => {
    if (player) {
      player.seekTo(seconds, true);
    }
  };

  return (
    <div>
      <div style={{ height: height }}>
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded YouTube Video"
        ></iframe>
      </div>
      {/* <div>
        <button onClick={() => seekToPart(30)}>Go to 30s</button>
        <button onClick={() => seekToPart(60)}>Go to 1 min</button>
        <button onClick={() => seekToPart(120)}>Go to 2 min</button>
      </div> */}
    </div>
  );
}

export default YouTubeEmbed;
