'use client';

import useAuth from './auth/useAuthHook';
import { useEffect } from "react";

export default function LoginPage() {
  const { loginWithRedirect } = useAuth();

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  return <p>Redirecting...</p>;
}
