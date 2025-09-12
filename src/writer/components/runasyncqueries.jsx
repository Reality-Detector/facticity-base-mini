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
