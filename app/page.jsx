// Renders the landing page, the /'/ endpoint so it is at the root level inside app directory

import Home from '@/components/Home';
import MiniAppInit from '@/components/MiniAppInit';

export default function HomePage() {
  return (
    <>
      <MiniAppInit />
      <Home />
    </>
  );
}

