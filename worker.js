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
    
    let results, tokens, scripts, exec, methods, error = undefined
      
    try {

      tokens = pathSegments.map(segment => esprima.tokenize(segment))
      scripts = pathSegments.map(segment => esprima.parseScript(segment))

      matcher = /(?<method>.+)\((?<args>.+)\)/g

      exec = pathSegments.map(segment => segment.matchAll(matcher))


        _[pathSegments[0]]()

      methods = Object.keys(_).reduce((acc, method) => {
        acc[method] = `https://lodash.do/${method}/:args${pathname}`
        return acc
      }, {})
    
    } catch(ex) {
      error = Object.entries(ex) 
    }

    return new Response(JSON.stringify({ api, tokens, scripts, url, pathSegments, pathOptions, exec, results, error, methods, user }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
  },
}
