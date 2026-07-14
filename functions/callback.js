export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code parameter', { status: 400 });
  }

  const tokenResponse = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: env.OAUTH_CLIENT_ID,
        client_secret: env.OAUTH_CLIENT_SECRET,
        code,
      }),
    }
  );

  const data = await tokenResponse.json();

  if (data.error) {
    return new Response(`OAuth error: ${data.error_description || data.error}`, {
      status: 400,
    });
  }

  const html = `<!DOCTYPE html>
<html><body>
<script>
  (function() {
    var msg = JSON.stringify({ token: '${data.access_token}', provider: 'github' });
    window.opener.postMessage(msg, '*');
    window.close();
  })();
</script>
</body></html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
