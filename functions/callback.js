export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

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

  const adminUrl = `${url.origin}/admin/`;
  const html = `<!DOCTYPE html>
<html><body>
<script>
  (function() {
    var data = { token: '${data.access_token}', provider: 'github' };
    try {
      // Try popup flow first
      if (window.opener && window.opener !== window) {
        window.opener.postMessage(JSON.stringify(data), '*');
        window.close();
      } else {
        // Redirect flow: store token and go to admin
        window.location.href = '${adminUrl}#access_token=${data.access_token}';
      }
    } catch(e) {
      window.location.href = '${adminUrl}#access_token=${data.access_token}';
    }
  })();
</script>
</body></html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
