// src/services/apiService.js

export const queryAPI = async (searchQuery, files, AccessToken) => {
    console.log('Searching for:', searchQuery);
    const payload = {
      question: searchQuery,
      files: files,
      index_name: 'pdf-embeddings-v2'
    };
    console.log({payload})
    try {
      const response = await fetch('https://backend.facticity.ai/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AccessToken}`,
          'Validator':'privy'
        },
        body: JSON.stringify(payload)
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Response:', data.response);
        return data.response;
      } else {
        console.error('Error in fetching data:', response.statusText);
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error during the search:', error);
      throw error;
    }
  };
  