// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './utils/reportWebVitals';
// import AuthWrapper from './auth/AuthWrapper';
// import { BrowserRouter } from 'react-router-dom'
// import { AppProvider } from './AppProvider';
// import AppVersionCheck from './utils/AppVersionCheck';
// import { PostHogProvider} from 'posthog-js/react'

// const REACT_APP_PUBLIC_POSTHOG_KEY= 'phc_kTQMJe9yTkyGTYZAZ4rTVQWEcAendbJtGNU2GN5MbXk'
// const REACT_APP_PUBLIC_POSTHOG_HOST= 'https://us.i.posthog.com'
// const options = {
//   api_host: REACT_APP_PUBLIC_POSTHOG_HOST,
// }

// // Configure which auth provider to use
// const USE_PRIVY = true; // Set to true to use Privy instead of Auth0

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <AuthWrapper usePrivy={USE_PRIVY}>
//       <PostHogProvider 
//         apiKey={REACT_APP_PUBLIC_POSTHOG_KEY}
//         options={options}
//       >
//         <AppProvider>
//           <BrowserRouter> 
//             <App>
//               <AppVersionCheck />
//             </App>
//           </BrowserRouter>
//         </AppProvider>
//       </PostHogProvider>
//     </AuthWrapper>
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

