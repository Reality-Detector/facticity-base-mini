// import { useContext } from 'react';
// import { AppContext } from './AppContext';

// // Custom hook to provide the API functions
// export function utils() {
//     const { url } = useContext(AppContext); // Get the URL from context

//     const splitText = async (text) => {
//         try {
//             const data = { query: text };
//             const response = await fetch(`${url}/split_sentence`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data),
//             });

//             const result = await response.json();
//             if (result.claims) {
//                 return result; // Return the claims array
//             } else {
//                 console.error('No claims returned from the API.');
//                 return null;
//             }
//         } catch (error) {
//             console.error('Error occurred while splitting sentence:', error);
//             return null;
//         }
//     };

//     const rewriteText = async (text) => {
//         try {
//             const data = { query: text };
//             console.log(data)
//             const response = await fetch(`${url}/rewrite`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data),
//             });

//             const result = await response.json();
//             console.log(result)
//             if (result) {
//                 return result; // Return the full response object
//             } else {
//                 console.error('No rewritten text returned from the API.');
//                 return null;
//             }
//         } catch (error) {
//             console.error('Error occurred while rewriting text:', error);
//             return null;
//         }
//     };

//     return { splitText, rewriteText };
// }


import { useContext } from 'react';
import { AppContext } from './AppContext';

// Custom hook to provide the API functions
export function useUtils() {
    const { url } = useContext(AppContext); // Get the URL from context

    const splitText = async (text) => {
        try {
            const data = { query: text };
            const response = await fetch(`${url}/split_sentence`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result.claims) {
                return result; // Return the claims array
            } else {
                console.error('No claims returned from the API.');
                return null;
            }
        } catch (error) {
            console.error('Error occurred while splitting sentence:', error);
            return null;
        }
    };

    const rewriteText = async (text) => {
        try {
            const data = { query: text };
            const response = await fetch(`${url}/rewrite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result) {
                return result; // Return the full response object
            } else {
                console.error('No rewritten text returned from the API.');
                return null;
            }
        } catch (error) {
            console.error('Error occurred while rewriting text:', error);
            return null;
        }
    };

    return { splitText, rewriteText };
}
