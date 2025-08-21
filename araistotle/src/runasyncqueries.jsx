// import { useState } from 'react';
// // import { ToastContainer, toast } from 'react-toastify';


// async function fetchWithRetry(url, retries = 3, delay = 1000) {
//   for (let i = 0; i < retries; i++) {
//       try {
//           const response = await fetch(url);
//           if (response.ok) {
//               const data = await response.json();
//               return { data, ok: response.ok };
//           } else {
//               throw new Error('Response not ok');
//           }
//       } catch (error) {
//           if (i === retries - 1) {
//               throw error;
//           }
//           await new Promise(resolve => setTimeout(resolve, delay));
//       }
//   }
// }



// export const createAndCheckTask = async (query, location, timestamp, userEmail, speaker, source, version, addMessage) => {
//   // console.log({executing: query})
//   const createTaskUrl = 'https://backend-word-testing-934923488639.us-central1.run.app/fact-check';
//   const checkStatusUrl = (taskId) => `https://backend-word-testing-934923488639.us-central1.run.app/check-task-status-fe?task_id=${taskId}`;
//   // const createTaskUrl = 'https://backend.facticity.ai/fact-check';
//   // const checkStatusUrl = (taskId) => `https://backend.facticity.ai/check-task-status-fe?task_id=${taskId}`;
//   var notiflist = []
//   var visint = 0
//   let output = null;
//   let error = false;
//   let loading = true;
//   const frontend_key = '8b13db53-187e-42d1-aced-f9@7197a768d';
 

//   try {
//     // Create the task

//     const createResponse = await Promise.race([
//       fetch(createTaskUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-API-KEY': frontend_key
//         },
//         body: JSON.stringify({
//           query,
//           location,
//           timestamp: new Date().toISOString(),
//           userEmail,
//           speaker,
//           source,
//           add: "",
//           timeout : 120,
//           mode : "async",
//           version: version,
//           deployment_mode: "frontend2"
//         })
//       }).then(response => response), // Convert the response to JSON
//       new Promise((resolve, reject) => 
//         setTimeout(() => resolve({ok:false, error: 'No task created within 30 seconds' }), 30000)
//       )
//     ]);
//     // console.log({createResponse})

//     if (createResponse.error === 'No task created within 30 seconds'){
//       return { output: {output:[],queries:[],disambiguation:"",status:"error",overall_assessment:"Query failed. Please try again",Classification:"",sources:[],question:query,location:location,userEmail:userEmail,type:"query",evidence:{},id:0}, error: "Task failed. Please try again.", loading: false };
//     }
    
//     if (!createResponse.ok) {
//       return { output: {output:[],queries:[],disambiguation:"",status:"error",overall_assessment:"Query failed. Please try again",Classification:"",sources:[],question:query,location:location,userEmail:userEmail,type:"query",evidence:{},id:0}, error: "Failed to process", loading: false };
//     }

//     // const createResponse = await createTaskWithRetry(query,location,timestamp,userEmail,speaker,source,5);

//     const createResult = await createResponse.json();

//     // console.log({executed: query, createResult:createResult})
//     // Check if the createResponse contains Classification
//     if (createResult.Classification) {
//       createResult['type'] = 'query'
//       // console.log({ output: createResult, error: null, loading: false })
//       return { output: createResult, error: null, loading: false };
//     }

//     const taskId = createResult.task_id;
//     if(!taskId){
//       return { output: {output:[],queries:[],disambiguation:"",status:"error",overall_assessment:"Query failed. Please try again",Classification:"",sources:[],question:query,location:location,userEmail:userEmail,type:"query",evidence:{},id:0}, error: "Task failed. Please try again.", loading: false };
//     }
//     // Check the task status periodically
//     const checkTaskStatus = async () => {
//       var waittime = 0
//       while (true) {
//         if (waittime>=4 & waittime%3==1){
//           var fetchOut = await fetchWithRetry(checkStatusUrl(taskId), 5, 1000);
//           var statusResult = fetchOut.data
  
//           // console.log(statusResult)
          
//           var tempstep = statusResult.step || [];
//           // const statusResponse = await fetch(checkStatusUrl(taskId));
//           // waittime +=1
//           // const statusResult = await statusResponse.json();
//           // var tempstep = statusResult.step;
//           if (tempstep.length>0){
//             addMessage(tempstep)
//           }
  
//           if (!fetchOut.ok || waittime > 90)  {
//             output = {
//               output:[],
//               queries:[],
//               disambiguation:"",
//               status:"error",
//               overall_assessment:"Query failed. Please try again",
//               Classification:"",
//               sources:[],
//               question:query,
//               location:location,
//               userEmail:userEmail,
//               type:"query",
//               evidence:{},
//               id:0
//             }
//             loading = false;
//             error = true;
//             // try {
//             //   const response = await fetch('https://fbdebate-a4xncz5jja-uc.a.run.app/log_error', {
//             //     method: 'POST',
//             //     headers: {
//             //       'Content-Type': 'application/json',
//             //     },
//             //     body: JSON.stringify({
//             //       query: query,
//             //       userEmail: userEmail,
//             //       message: "waited too long"
//             //     }),
//             //   });
//             //   // console.log(response)
              
//             // } catch (error) {
              
//             // }
//             break;
//           }
  
  
//           if (statusResult.status === 'completed') {
//             if(statusResult.result){
//               output = statusResult.result
//             }else{
//               output = statusResult;
//             }
  
//             loading = false;
//             break;
//           }
       
//         }
//         waittime += 1;
//         await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
//       }
//     };

//     await checkTaskStatus();
//   } catch (err) {
//     error = true;
//     loading = false;
//   }
//   // console.log({ output, error, loading })
//   return { output, error, loading };
// };


import { useState } from 'react';




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
  const url = backendUrl+'/fact-check-sync';
  // const url = 'https://backend.facticity.ai/fact-check-sync'
  // const url = 'https://backend-word-testing-934923488639.us-central1.run.app/fact-check-sync'
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
