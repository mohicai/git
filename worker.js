const hub_host = 'github.com'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const userAgent = request.headers.get('User-Agent') || ''

    // 判断是否为 Git 客户端请求
    // Git 的 UA 通常包含 "git/" 字样
    const isGit = userAgent.toLowerCase().includes('git')

    if (!isGit && url.pathname === '/') {
      // 如果是浏览器直接访问根目录，返回简单文本，不渲染 GitHub 页面
      return new Response('GitHub Proxy is running. Use it via: git clone https://' + url.host + '/username/repo.git', {
        status: 200,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
      })
    }

    // 否则，执行正常的代理逻辑
    url.host = hub_host
    const new_request = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    })

    return fetch(new_request)
  }
}