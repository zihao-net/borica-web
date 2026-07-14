// POST /admin/api/login
export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const body = await request.json();
  if (body.password === env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ token: env.ADMIN_PASSWORD }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return new Response(JSON.stringify({ error: '密码错误' }), {
    status: 401, headers: { 'Content-Type': 'application/json' }
  });
}
