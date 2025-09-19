// app/api/[...path]/route.js
export const runtime = 'nodejs';

async function forwardRequest(request, { params }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  // Reconstruct target URL
  const pathSegments = params.path || [];
  const targetPath = '/' + pathSegments.join('/');
  const searchParams = request.nextUrl.search;
  const targetUrl = `${backendUrl}${targetPath}${searchParams}`;
  
  // Prepare request options
  const init = {
    method: request.method,
    headers: new Headers(request.headers),
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body
  };
  
  // Remove host header to avoid conflicts
  init.headers.delete('host');
  
  try {
    // Forward request to backend
    const response = await fetch(targetUrl, init);
    
    // Return response with same status and headers
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Export handlers for all HTTP methods
export const GET = forwardRequest;
export const POST = forwardRequest;
export const PUT = forwardRequest;
export const PATCH = forwardRequest;
export const DELETE = forwardRequest;