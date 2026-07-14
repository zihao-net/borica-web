// GET /admin/api/item?collection=xxx&slug=yyy
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const collection = url.searchParams.get('collection');
  const slug = url.searchParams.get('slug');
  if (!collection || !slug) return json({ error: 'Missing params' }, 400);

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

  const path = `${folder}/${slug}.md`;

  try {
    const res = await fetch(`https://api.github.com/repos/zihao-net/borica-web/contents/${path}?ref=main`, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'User-Agent': 'borica-admin' }
    });

    if (!res.ok) {
      if (res.status === 404) return json({ error: '文件不存在' }, 404);
      return json({ error: 'GitHub API: ' + res.status }, 500);
    }

    const data = await res.json();
    const content = decodeContent(data.content);
    const parsed = parseFull(content);

    return json({
      slug,
      path,
      sha: data.sha,
      front: parsed.front,
      body: parsed.body
    });
  } catch(e) {
    return json({ error: e.message }, 500);
  }
}

function parseFull(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { front: { title: 'No front matter' }, body: content };
  return { front: parseYaml(match[1]), body: match[2].trimStart() };
}

function parseYaml(yaml) {
  const result = {};
  const lines = yaml.split('\n');
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^(\w+):\s*(.*)$/);
    if (m) {
      let val = m[2].trim();
      if (val === 'true') result[m[1]] = true;
      else if (val === 'false') result[m[1]] = false;
      else if (/^\d+$/.test(val)) result[m[1]] = parseInt(val);
      else result[m[1]] = val.replace(/^["']|["']$/g, '');
    }
    i++;
  }
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
