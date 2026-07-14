export async function onRequest({ env }) {
  const clientId = env.OAUTH_CLIENT_ID;
  const origin = env.ORIGIN || 'https://www.boricatec.com';
  const redirectUri = `${origin}/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'repo,user',
    redirect_uri: redirectUri,
  });

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
    302
  );
}
