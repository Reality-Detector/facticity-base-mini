export async function getYoutubeVideoDetails(url) {
    const apiKey = 'AIzaSyCiz6eck0GFyYMN4YOkAnPWnsANF7b-6Ww'; // Replace with your actual API key
  
    // Function to extract video ID from YouTube URL
    function extractVideoID(url) {
      const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    }
  
    const videoID = extractVideoID(url);
    if (!videoID) {
      throw new Error('Invalid YouTube URL');
    }
  
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${apiKey}&part=snippet,contentDetails`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (data.items.length === 0) {
        throw new Error('Video not found');
      }
  
      const videoDetails = {
        title: data.items[0].snippet.title,
        channel: data.items[0].snippet.channelTitle,
        duration: data.items[0].contentDetails.duration,
      };
  
      return videoDetails;
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw error;
    }
  }
  