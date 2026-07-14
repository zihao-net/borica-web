export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const origin = url.origin;
  const clientId = env.OAUTH_CLIENT_ID;
  const redirectUri = `${origin}/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'repo,user',
    redirect_uri: redirectUri,
  });

  // Forward CSRF state parameter from CMS
  const state = url.searchParams.get('state');
  if (state) {
    params.set('state', state);
  }

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
    302
  );
}
