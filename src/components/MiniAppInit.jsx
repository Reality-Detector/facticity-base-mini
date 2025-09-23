'use client';
import { useEffect } from 'react';

export default function MiniAppInit() {
  useEffect(() => {
    // MiniKit functionality temporarily disabled - import not available in current @coinbase/onchainkit version
    console.log('MiniAppInit component loaded');
  }, []);

  return null;
}
