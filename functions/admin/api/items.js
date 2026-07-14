// GET /admin/api/items?collection=xxx
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const collection = url.searchParams.get('collection');
  if (!collection) return json({ error: 'Missing collection' }, 400);

  const token = await getToken(request, env);
  if (!token) return json({ error: 'Unauthorized' }, 401);

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

  try {
    const res = await fetch(`https://api.github.com/repos/zihao-net/borica-web/contents/${folder}?ref=main`, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'User-Agent': 'borica-admin' }
    });

    if (!res.ok) {
      const err = await res.text();
      return json({ error: 'GitHub API: ' + res.status + ' ' + err.substring(0,200) }, 500);
    }

    const files = await res.json();
    const items = files.filter(f => f.name.endsWith('.md')).map(f => ({
      slug: f.name.replace(/\.md$/, ''),
      path: f.path,
      sha: f.sha
    }));

    // Get title from each file content (first 200 bytes for front matter)
    for (const item of items) {
      try {
        const cres = await fetch(`https://api.github.com/repos/zihao-net/borica-web/contents/${item.path}?ref=main`, {
          headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'User-Agent': 'borica-admin' }
        });
        if (cres.ok) {
          const cd = await cres.json();
          const content = decodeContent(cd.content);
          const fm = parseFrontMatter(content);
          item.title = fm.title || item.slug;
          item.updated = cd.sha.substring(0, 7);
        }
      } catch(e) {
        item.title = item.slug;
      }
    }

    return json({ items });
  } catch(e) {
    return json({ error: e.message }, 500);
  }
}

function parseFrontMatter(content) {
  const result = {};
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return result;
  const yaml = match[1];
  yaml.split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) {
      let val = m[2].trim();
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (/^\d+$/.test(val)) val = parseInt(val);
      else val = val.replace(/^["']|["']$/g, '');
      result[m[1]] = val;
    }
  });
  return result;
}

async function getToken(request, env) {
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

// Files are double-base64 encoded due to upload script: stored content is itself a base64 string
function decodeContent(raw) {
  const b64 = atob(raw.replace(/\s/g, ''));
  const bin = atob(b64.replace(/\s/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder('utf-8').decode(bytes);
}
