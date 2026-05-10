export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const userAgent = request.headers.get('User-Agent') || '';

  // 这里建议直接硬编码，或者确保你在 Pages 后台配置了环境变量 HOST
  const hub_host = env.HOST || 'github.com';

  // 判断是否为 Git 客户端请求
  const isGit = userAgent.toLowerCase().includes('git');

  // 如果是浏览器访问根目录
  if (!isGit && url.pathname === '/') {
    return new Response('GitHub Proxy (Pages) is running. Use it via: git clone https://' + url.host + '/username/repo.git', {
      status: 200,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
    });
  }

  // 构造发往 GitHub 的请求
  const targetUrl = new URL(request.url);
  targetUrl.host = hub_host;

  const newRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow'
  });

  return fetch(newRequest);
}