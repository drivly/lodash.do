import _ from 'lodash'
import esprima from 'esprima-next'

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
    
    const tokens = pathSegments.map(segment => esprima.tokenize(segment))
    const scripts = pathSegments.map(segment => esprima.parseScript(segment))
    
    const matcher = /(?<method>.+)\((?<args>.+)\)/g
    
    const exec = pathSegments.map(segment => segment.matchAll(matcher))
    
    let results, error = undefined
    
    try {
      _[pathSegments[0]]()
    } catch(ex) {
      error = Object.entries(ex) 
    }
    
    const methods = Object.keys(_).reduce((acc, method) => {
      acc[method] = `https://lodash.do/${method}/:args${pathname}`
      return acc
    }, {})

    return new Response(JSON.stringify({ api, tokens, scripts, url, pathSegments, pathOptions, exec, results, error, methods, user }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
  },
}
