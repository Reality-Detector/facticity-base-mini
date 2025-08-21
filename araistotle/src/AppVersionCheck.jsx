import useAuth from './useAuthHook';
import React from 'react';

const AppVersionCheck = () => {
  const { logout } = useAuth();
  const REQUIRED_VERSION = '3.2.0';
  React.useEffect(() => {
    const storedVersion = localStorage.getItem('app_version');
    if (storedVersion !== REQUIRED_VERSION) {
      localStorage.setItem('app_version', REQUIRED_VERSION);
      logout({ logoutParams: { returnTo: "https://app.facticity.ai" } });
    }
  }, []);

  return null;
};

export default AppVersionCheck;
