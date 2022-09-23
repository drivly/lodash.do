import _ from 'lodash'

export const api = {
  icon: '⚡️',
  name: 'lodash.do',
  description: 'Chainable Lodash API',
  url: 'https://lodash.do/api',
  type: 'https://apis.do/transformation',
  endpoints: {
    list: 'https://lodash.do/list',
    get: 'https://lodash.do/:id',
  },
  site: 'https://lodash.do',
  login: 'https://lodash.do/login',
  signup: 'https://lodash.do/signup',
  repo: 'https://github.com/drivly/lodash.do',
}

export default {
  fetch: async (req, env) => {
    const { user, origin, requestId, method, body, time, pathname, pathSegments, pathOptions, url, query } = await env.CTX.fetch(req).then(res => res.json())
    
    const methods = Object.keys(_).reduce((acc, method) => acc[method] = `https://lodash.do/${method}${pathname}` && acc)

    return new Response(JSON.stringify({ api, url, pathSegments, pathOptions, methods, user }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
  },
}
