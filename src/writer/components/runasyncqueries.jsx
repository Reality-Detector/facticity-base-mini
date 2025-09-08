// Utility function to perform fetch with retry mechanism
async function fetchWithRetry(url, retries = 3, delay = 1000, AccessToken) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${AccessToken}`,
          'Validator':'privy',
        }
      });
      if (response.ok) {
        const data = await response.json();
        return { data, ok: true };
      } else {
        throw new Error('Response not ok');
      }
    } catch (error) {
      if (attempt === retries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Main function to create and check the task
export const createAndCheckTask = async (
  query,
  location,
  timestamp,
  userEmail,
  speaker,
  source,
  mode,
  filter,
  addMessage,
  context,
  files,
  getClaimsRemaining,
  AccessToken,
  backendUrl
) => {
  const createTaskUrl = '/api/fact-check';
  const checkStatusUrl = (taskId) => `/api/check-task-status?task_id=${taskId}`;
  
  // Initialize response variables
  let output = null;
  let error = null;
  const loading = true;

  // Prepare the request body
  const requestBody = JSON.stringify({
    query,
    context,
    timeout: 60,
    mode: "async",
    version: "pro",
    userEmail: userEmail,
    include_custom: files,
    // deployment_mode: "wordbeta",
    deployment_mode: "writer",
    filters:filter
  });

  console.log({ executing: query });
  console.log({ body: requestBody });
  console.log({ files });

  try {
    // Create the task with a 30-second timeout
    const createResponse = await Promise.race([
      fetch(createTaskUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': '7996b7f1-db6d-42f3-bd30-460c2a684607',
          'Authorization': `Bearer ${AccessToken}`,
          'Validator':'privy',
          'accept': 'application/json'
        },
        body: requestBody
      }),
      new Promise((resolve) =>
        setTimeout(() => resolve({ ok: false, error: 'No task created within 30 seconds' }), 30000)
      )
    ]);

    console.log({ createResponse });

    // Handle the 30-second creation timeout
    if (createResponse.error === 'No task created within 30 seconds') {
      return {
        output: {
          output: [],
          queries: [],
          disambiguation: "",
          status: "error",
          overall_assessment: "Query failed. Please try again",
          Classification: "",
          sources: [],
          question: query,
          location,
          userEmail,
          type: "query",
          evidence: {},
          id: 0,
          message: ""
        },
        error: "Task failed. Please try again.",
        loading: false
      };
    }

    // console.log({createResponse})
    const createResult = await createResponse.json();
    // Handle unsuccessful creation response
    if (!createResponse.ok) {
      return {
        output: {
          output: [],
          queries: [],
          disambiguation: "",
          status: "error",
          overall_assessment: "Query failed. Please try again",
          Classification: "",
          sources: [],
          question: query,
          location,
          userEmail,
          type: "query",
          evidence: {},
          id: 0,
          input: query,
          message: createResult?.message || null
        },
        error: "Failed to process",
        loading: false
      };
    }

    // Parse the creation response

    console.log({ executing: query, createResult });

    // If Classification is already present, return the result immediately
    if (createResult.Classification) {
      return { output: createResult, error: null, loading: false };
    }

    const taskId = createResult.task_id;
    if (!taskId) {
      return {
        output: {
          output: [],
          queries: [],
          disambiguation: "",
          status: "error",
          overall_assessment: "Query failed. Please try again",
          Classification: "",
          sources: [],
          question: query,
          location,
          userEmail,
          type: "query",
          evidence: {},
          id: 0
        },
        error: "Task failed. Please try again.",
        loading: false
      };
    }

    // Function to poll the task status with a total timeout of 45 seconds
    const pollTaskStatus = async () => {
      const maxWaitTime = 120; // seconds
      let elapsedTime = 0;

      while (elapsedTime < maxWaitTime) {

        var cr = getClaimsRemaining()

        console.log("Claims remaining",cr)

        if (cr === 0) {
          console.log("No claims to process, skipping 'check-task-status' calls.");
          return {
            output: {
              output: [],
              queries: [],
              disambiguation: "",
              status: "error",
              overall_assessment: "Stopped Processing",
              Classification: "",
              sources: [],
              question: query,
              location,
              userEmail,
              type: "query",
              evidence: {},
              id: 0
            },
            error: "No claims to process. Stopped status checks.",
            loading: false
          };
        }

        console.log("CHECKING TASK STATUS "+elapsedTime);
        try {
          if (elapsedTime>=7 & elapsedTime%2==1){
            const fetchOut = await fetchWithRetry(checkStatusUrl(taskId), 7, 1000, AccessToken);
            console.log({ fetchOut });
  
            const statusResult = fetchOut.data;
            console.log(statusResult);
  
            // Check if the task has reached a final state
            if (
              statusResult.Classification === 'True' ||
              statusResult.Classification === 'False' ||
              statusResult.Classification === 'Unverifiable'
            ) {
              return { output: statusResult, error: null, loading: false };
            }
          }
        } catch (err) {
          console.error("Error fetching task status:", err);
          // Optionally, you can decide to break or continue based on the error
        }

        // Wait for 1 second before the next poll
        await new Promise(resolve => setTimeout(resolve, 1000));
        elapsedTime += 1;
      }

      // If the loop completes without returning, it means we've hit the timeout
      return {
        output: {
          output: [],
          queries: [],
          disambiguation: "",
          status: "error",
          overall_assessment: "Query failed. Please try again",
          Classification: "",
          sources: { sources: [], support: 'None' },
          question: query,
          location,
          userEmail,
          input: query,
          references: { "": "" },
          sources_array: { 'negative': [], 'positive': [], 'neutral': [] },
          evidence: {},
          tldr_text: "",
          correction_text: [{ "": "" }],
          task_id: 0,
        },
        error: true,
        loading: false
      };
    };

    // Use Promise.race to handle the polling with a 45-second timeout
    const taskStatus = await pollTaskStatus();
    return taskStatus;

  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return {
      output: null,
      error: `An error occurred: ${err.message}`,
      loading: false
    };
  }
};



// export const createAndCheckTask = async (
//   query,
//   location,
//   timestamp,
//   userEmail,
//   speaker,
//   source,
//   mode,        // kept for backwards compatibility (originally used for async tasks)
//   filter,
//   addMessage,
//   context,
//   files,
//   getClaimsRemaining
// ) => {
//   // Use your sync endpoint URL (adjust as needed)
//   const url = 'http://127.0.0.1:5000/fact-check-sync';
//   let output = null;
//   let error = false;
//   let loading = true;
//   const frontend_key = '8b13db53-187e-42d1-aced-f9@7197a768d';

//   // Prepare the request payload (note the mix of original parameters)
//   const requestBody = JSON.stringify({
//     query,
//     location,
//     timestamp, // using provided timestamp
//     userEmail,
//     speaker,
//     source,
//     context,
//     filters: filter,
//     include_custom: files,
//     timeout: 120,       // increased timeout for sync streaming
//     mode: 'sync',       // force synchronous mode for streaming response
//     version: "pro",     // default version; adjust if needed
//     deployment_mode: 'writer'
//   });

//   console.log({ executing: query });
//   console.log({ body: requestBody });
//   console.log({ files });

//   // This will be used to accumulate any text that isn’t immediately parsed
//   let accumulated = '';

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-API-KEY': frontend_key,
//       },
//       body: requestBody
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch task');
//     }

//     // Get the reader from the streaming response
//     const reader = response.body.getReader();
//     const decoder = new TextDecoder();
//     let done = false;

//     while (!done) {
//       // Check remaining claims before processing the next chunk
//       if (getClaimsRemaining && typeof getClaimsRemaining === 'function') {
//         const claimsRemaining = getClaimsRemaining();
//         console.log("Claims remaining", claimsRemaining);
//         if (claimsRemaining === 0) {
//           console.log("No claims to process, stopping streaming.");
//           addMessage && addMessage("No claims to process, stopping streaming.");
//           // Cancel the stream to avoid unnecessary processing
//           await reader.cancel();
//           return {
//             output: {
//               output: [],
//               queries: [],
//               disambiguation: "",
//               status: "error",
//               overall_assessment: "Stopped Processing",
//               Classification: "",
//               sources: [],
//               question: query,
//               location,
//               userEmail,
//               type: "query",
//               evidence: {},
//               id: 0
//             },
//             error: "No claims to process. Stopped streaming.",
//             loading: false
//           };
//         }
//       }

//       // Read the next chunk from the stream
//       const { value, done: doneReading } = await reader.read();
//       done = doneReading;
//       if (value) {
//         const chunkText = decoder.decode(value, { stream: !done });
//         try {
//           // Try to parse the chunk as JSON
//           const jsonChunk = JSON.parse(chunkText);
//           console.log({ jsonChunk });

//           // If an intermediate message is provided, report it via the addMessage callback
//           if (jsonChunk['verifying source']) {
//             addMessage && addMessage(jsonChunk['verifying source']);
//           } else if (jsonChunk['final']) {
//             // Capture the final result
//             output = jsonChunk['final'];
//           } else {
//             // If the JSON does not match expected keys, accumulate it
//             accumulated += chunkText;
//           }
//         } catch (parseError) {
//           // If parsing fails, assume the text is part of the final result and accumulate it
//           accumulated += chunkText;
//         }
//       }
//     }

//     // If we never received a parsed "final" result but have accumulated text,
//     // try to parse it one last time.
//     if (!output && accumulated) {
//       try {
//         output = JSON.parse(accumulated);
//       } catch (err) {
//         output = accumulated;
//       }
//     }
//     loading = false;
//   } catch (err) {
//     console.error("An error occurred:", err);
//     error = true;
//     loading = false;
//   }

//   return { output, error, loading };
// };
