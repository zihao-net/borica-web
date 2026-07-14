// POST /admin/api/delete
export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const token = getToken(request, env);
  if (!token) return json({ error: 'Unauthorized' }, 401);

  const body = await request.json();
  const { collection, slug } = body;
  if (!collection || !slug) return json({ error: 'Missing params' }, 400);

  const folders = {
    products_zh: 'src/content/products/zh',
    products_en: 'src/content/products/en',
    solutions_zh: 'src/content/solutions/zh',
    solutions_en: 'src/content/solutions/en',
    case_studies_zh: 'src/content/caseStudies/zh',
    case_studies_en: 'src/content/caseStudies/en',
  };

  const folder = folders[collection];
  if (!folder) return json({ error: 'Invalid collection' }, 400);

  const path = `${folder}/${slug}.md`;

  // Get SHA first
  const getRes = await fetch(`https://api.github.com/repos/zihao-net/borica-web/contents/${path}?ref=main`, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'User-Agent': 'borica-admin' }
  });
  if (!getRes.ok) return json({ error: 'File not found' }, 404);
  const data = await getRes.json();

  const delRes = await fetch(`https://api.github.com/repos/zihao-net/borica-web/contents/${path}`, {
    method: 'DELETE',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'borica-admin'
    },
    body: JSON.stringify({
      message: `CMS: delete ${slug}`,
      sha: data.sha,
      branch: 'main'
    })
  });

  if (!delRes.ok) {
    const err = await delRes.text();
    return json({ error: 'GitHub delete failed: ' + err.substring(0, 300) }, 500);
  }

  return json({ success: true });
}

function getToken(request, env) {
  const auth = request.headers.get('Authorization');
  const reqToken = auth && auth.startsWith('Bearer ') ? auth.substring(7) : null;
  if (reqToken === env.ADMIN_PASSWORD && env.GITHUB_TOKEN) return env.GITHUB_TOKEN;
  return null;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' }
  });
}
