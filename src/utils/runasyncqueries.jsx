
export const createAndCheckTask = async (
  query,
  location,
  timestamp,
  userEmail,
  speaker,
  source,
  version,
  addMessage,
  backendUrl,
  source_find_mode,
  setVisualisationMode,
  isVideo,
  AccessToken
) => {
  const url = '/api/fact-check-sync';
  let output = null;
  let error = false;
  let loading = true;

  // Array to store all intermediate steps
  const intermediateSteps = [];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AccessToken}`,
        'Validator':'privy'
      },
      body: JSON.stringify({
        query,
        location,
        timestamp: new Date().toISOString(),
        userEmail,
        speaker,
        source,
        add: '',
        timeout: 120,
        mode: 'sync', // Get a streaming response
        version: version,
        deployment_mode: 'frontend2',
        source_find_mode: source_find_mode,
        is_longcheck: isVideo,
        requester_url: "https://araistotle.facticity.ai"
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let sourceCount = 0;
    let messageCount = 0;
    let accumulated = '';
    // let output = null;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunkText = decoder.decode(value, { stream: !done });

        try {
          // Split the chunkText into individual JSON objects if there are multiple
          const jsonChunks = chunkText.trim().split("\n").filter(line => line.trim() !== "");
        
          jsonChunks.forEach(jsonStr => {
            try {
              const jsonChunk = JSON.parse(jsonStr);
              console.log({ jsonChunk });
        
              if (jsonChunk['verifying source']) {
                addMessage(jsonChunk['verifying source']);
                sourceCount = sourceCount + jsonChunk['verifying source'].length
              } else if (jsonChunk['final']) {
                output = JSON.parse(jsonChunk['final']);
                output['sourceCount'] = sourceCount;
                output['new_search'] = messageCount > 0;
                // addMessage(jsonChunk['message'],'')
              } else if (jsonChunk['visualisationMode']) {
                console.log("setting vis mode")
                console.log(JSON.parse(jsonChunk['visualisationMode']))
                setVisualisationMode(JSON.parse(jsonChunk['visualisationMode']))
              }else if (jsonChunk['message']) {
                console.log(jsonChunk['message']);
                addMessage(jsonChunk['message'],'message')
                messageCount =messageCount +1;
              } else {
                accumulated += jsonStr;
              }
            } catch (innerParseError) {
              console.log("Failed to parse JSON chunk:", { jsonStr, innerParseError });
              accumulated += jsonStr; // Accumulate unparsed chunks
            }
          });
        
        } catch (parseError) {
          console.log({ chunkText, parseError });
        }
      }
    }

    // Try to parse the final accumulated result.
    loading = false;
  } catch (err) {
    console.error(err);
    error = true;
    loading = false;
  }
  // output.Classification = ""
  return { output, error, loading };
};
