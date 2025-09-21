// 'use client';
// Next.js will render your pages inside whatever you return from the layout.
import ClientProviders from './ClientProviders';
import '../src/styles/globals.css';
import '@coinbase/onchainkit/styles.css';
export const metadata = { title: 'Facticity AI' }; // configure SEO related info like title, description

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="nes-ui nes-ui-dark-mode">
      <head>
        {/* For mini app preview */}
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:miniapp:title" content="Facticity AI" />
        <meta name="fc:miniapp:button" content="Open in Mini App" />
        <meta name="fc:miniapp:url" content="https://yourdomain.com" />
        <meta property="og:title" content="Facticity AI" />
        <meta property="og:description" content="AI-powered fact checking across text, audio, video." />
        <meta property="og:image" content="https://yourdomain.com/og.png" />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
        </body>
    </html>
  );
}
