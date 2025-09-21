'use client';
import { useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

export default function MiniAppInit() {
  const { sdk } = useMiniKit(); // access to low-level MiniKit SDK

  useEffect(() => {
    (async () => {
      if (!sdk) return;
      // Notify the host app your UI is ready. You can also disable native gestures if you use swipe UIs.
      await sdk.actions.ready(/* { disableNativeGestures: true } */);
    })();
  }, [sdk]);

  return null;
}
