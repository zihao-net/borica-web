// GET /admin/api/debug
export async function onRequest({ request, env }) {
  const token = env.GITHUB_TOKEN;

  // Fetch actual file from GitHub
  const res = await fetch("https://api.github.com/repos/zihao-net/borica-web/contents/src/content/products/zh/brk-bc08.md?ref=main", {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'User-Agent': 'borica-admin' }
  });
  const data = await res.json();
  const rawContent = data.content;

  // Method 1: plain atob
  let m1 = '';
  try {
    const cleaned = rawContent.replace(/\n/g, '');
    m1 = atob(cleaned);
  } catch(e) { m1 = 'ERROR: ' + e.message; }

  // Method 2: atob without cleaning
  let m2 = '';
  try {
    m2 = atob(rawContent);
  } catch(e) { m2 = 'ERROR: ' + e.message; }

  return new Response(JSON.stringify({
    contentLength: rawContent.length,
    contentStart: rawContent.substring(0, 30),
    m1Start: m1.substring(0, 60),
    m2Start: m2.substring(0, 60),
    encoding: data.encoding,
    size: data.size
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
