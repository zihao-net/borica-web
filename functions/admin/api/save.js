// POST /admin/api/save
export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const token = getToken(request, env);
  if (!token) return json({ error: 'Unauthorized' }, 401);

  const body = await request.json();
  const { collection, slug, front, body: mdBody } = body;
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

  // Construct front matter YAML
  let yaml = '';
  for (const [key, val] of Object.entries(front || {})) {
    if (val === true || val === false) {
      yaml += `${key}: ${val}\n`;
    } else if (typeof val === 'number') {
      yaml += `${key}: ${val}\n`;
    } else if (val && typeof val === 'string') {
      if (val.includes(':') || val.includes('#') || val.includes("'") || val.length > 40) {
        yaml += `${key}: "${val.replace(/"/g, '\\"')}"\n`;
      } else {
        yaml += `${key}: ${val}\n`;
      }
    }
  }

  const newContent = `---\n${yaml}---\n${mdBody || ''}`;
  const encoded = encodeContent(newContent);

  // Get existing file SHA for update
  let sha = null;
  const getRes = await fetch(`https://api.github.com/repos/zihao-net/borica-web/contents/${path}?ref=main`, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'User-Agent': 'borica-admin' }
  });
  if (getRes.ok) {
    const data = await getRes.json();
    sha = data.sha;
  }

  const commitMessage = sha ? `CMS: update ${slug}` : `CMS: create ${slug}`;

  const putRes = await fetch(`https://api.github.com/repos/zihao-net/borica-web/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'borica-admin',
      Accept: 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      message: commitMessage,
      content: encoded,
      sha: sha || undefined,
      branch: 'main'
    })
  });

  if (!putRes.ok) {
    const err = await putRes.text();
    return json({ error: 'GitHub save failed: ' + err.substring(0, 300) }, 500);
  }

  const result = await putRes.json();
  return json({ success: true, sha: result.content ? result.content.sha : null });
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

// Double-encode to match existing file format (stored content is base64 string)
function encodeContent(str) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(btoa(binary));
}
