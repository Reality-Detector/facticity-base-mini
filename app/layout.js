
// Next.js will render your pages inside whatever you return from the layout.
import ClientProviders from './ClientProviders';
export const metadata = { title: 'Facticity AI' }; // configure SEO related info like title, description

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
        </body>
    </html>
  );
}
