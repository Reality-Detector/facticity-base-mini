export const runtime = 'nodejs';

export async function forwardRequest(request, { params }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { path } = await params;
  const pathSegments = path || [];
  const targetPath = '/' + pathSegments.join('/');
  const searchParams = request.nextUrl.search;
  const targetUrl = `${backendUrl}${targetPath}${searchParams}`;
  
  const init = {
    method: request.method,
    headers: new Headers(request.headers),
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    duplex: 'half'
  };
  
  init.headers.delete('host');
  
  try {
    const response = await fetch(targetUrl, init);
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

export const GET = forwardRequest;
export const POST = forwardRequest;
export const PUT = forwardRequest;
export const PATCH = forwardRequest;
export const DELETE = forwardRequest;