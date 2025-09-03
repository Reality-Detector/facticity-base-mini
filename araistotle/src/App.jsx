import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Home from './components/Home';
import Settings from './components/Settings/Settings';
import useAuth from './useAuthHook';
import Api from './API';
import Subscription from './Subscription';
import Referral from './Referral';
import AuthWriterWrapper from './writer';
import TikTokDownloader from './tiktok/tiktokdownloader';
import Debate2 from './kamalaharrisdebate/Debate2';
import Debate1 from './bidentrumpdebate/Debate1';
import Discover from './components/Discover';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Success from "./Success";
import Cancel from "./Cancel";
import Walkthrough from './Walkthrough';
import WalkthroughFactCheck from './WalkthroughFactCheck';
import CreditBreakdown from './components/CreditBreakdown';
import Game from './game';
import SignupRedirect from './components/SignupRedirect';
import SignupGoogleRedirect from './components/SignupGoogleRedirect';
import SignupEmailRedirect from './components/SignupEmailRedirect';
import LoginPage from './login';
import AuthErrorBanner from './components/AuthErrorBanner';

const App = () => {
  const { user, isAuthenticated }  = useAuth();

  return (
    // <TikTokDownloader/>
    <ThemeProvider theme={theme}>
      <div>
        <AuthErrorBanner />
        <Routes>
          {/* <Route path="/tiktok" element={<TikTokDownloader/>}/> */}
          <Route path="/" element={<Home />} />
          <Route path="/c/:id" element={<Home />} />
          <Route path="/c/" element={<Home />} />
          <Route path="/game" element={<Home />} />
          <Route path="/signup" element={<SignupRedirect />} />
          <Route path="/signup-google" element={<SignupGoogleRedirect />} />
          <Route path="/signup-email" element={<SignupEmailRedirect />} />
          <Route path="/settings" element={<Settings />} />
          {/* <Route path="/api" element={<Api />} /> */}
          <Route path="/writer" element={<AuthWriterWrapper />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path = "/subscription" element = {<Subscription />} /> */}
          {/* <Route path = "/blog/harrisvtrump" element = {<Debate2 />} /> */}
          {/* <Route path = "/blog/bidenvtrump" element = {<Debate1 />} /> */}
          {/* <Route path="/discover/:tab" element={<Discover />} /> */}
          {/* <Route path="/discover" element={<Navigate to="/discover/feed" replace />} /> */}
          <Route path = "/rewards" element = {<Referral />} />
          {/* <Route path="/success" element={<Success />} /> */}
          {/* <Route path="/cancel" element={<Cancel />} /> */}
          <Route path = "/credits" element = {<CreditBreakdown />} />
          {/* <Route path = "/discover" element = {<Discover />} /> */}
        </Routes>
        <Walkthrough />
      </div>
    </ThemeProvider>

  );
};

export default App;