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
  fetch: async (req) => {
    const { user, origin, requestId, method, body, time, pathSegments, pathOptions, url, query } = await env.CTX.fetch(req).then(res => res.json())

    return new Response(JSON.stringify({ api, requestId, url, pathSegments, pathOptions, user }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
  },
}
