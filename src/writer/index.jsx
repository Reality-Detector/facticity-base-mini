// // src/index.js
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import { AppProvider } from './components/AppContext';
// import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
// // src/index.js
// import './index.css';


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//       <Auth0Provider
//           domain="dev-5h33aun.us.auth0.com"
//           clientId="fvsQ9DT16eWAbmF6IL6ZApvkpdgjtf3L"
//           authorizationParams={{
//             redirect_uri: window.location.origin
//           }}
//           // useRefreshTokens={ false }
//           cacheLocation="localstorage"
//         >
//           <AppProvider>
//             <App />
//           </AppProvider>
//         </Auth0Provider>
//   </React.StrictMode>
// );




"use client";
import React from 'react';
import Writer from './Writer';
import { AppProvider } from './components/AppContext';
import { Auth0Provider } from '@auth0/auth0-react';

const AuthWriterWrapper = () => {
  return (
    <Auth0Provider
      domain="dev-5h33aun.us.auth0.com"
      clientId="fvsQ9DT16eWAbmF6IL6ZApvkpdgjtf3L"
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
        audience: 'https://backend.facticity.ai',
        scope: 'openid profile email offline_access'
      }}
      cacheLocation="localstorage"
    >
      <AppProvider>
        <Writer />
      </AppProvider>
    </Auth0Provider>
  );
};



export default AuthWriterWrapper;