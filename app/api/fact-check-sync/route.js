export const runtime = 'nodejs';

export async function POST(request) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const targetUrl = `${backendUrl}/fact-check-sync`;
  
  const init = {
    method: 'POST',
    headers: new Headers(request.headers),
    body: request.body,
    duplex: 'half'
  };
  
  init.headers.delete('host');
  
  try {
    const response = await fetch(targetUrl, init);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
      }
    });
  } catch (error) {
    console.error('Streaming proxy error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}