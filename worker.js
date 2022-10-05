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
    '_': 'https://lodash.do/:method/:args/:url',
  },
  site: 'https://lodash.do',
  login: 'https://lodash.do/login',
  signup: 'https://lodash.do/signup',
  repo: 'https://github.com/drivly/lodash.do',
}

export const examples = {
  mapNameFromNorthwindProducts: 'https://lodash.do/map/Products.name/json.fyi/northwind.json',
  chunkData: 'https://lodash.do/chunk/2',
}

export default {
  fetch: async (req, env) => {
    const { user, origin, requestId, method, body, time, pathname, pathSegments, pathOptions, url, query, rootPath } = await env.CTX.fetch(req).then(res => res.json())
    if (rootPath) return new Response(JSON.stringify({ api, examples, user }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
    
    console.log(pathOptions)
    
    // let [func,args,...target] = pathOptions ? pathSegments.slice(1) : pathSegments
    // let results, tokens, scripts, exec, methods = undefined

    const allMethods = Object.keys(_)
    
    let methods = []
    let segments = pathSegments

    while (_[segments[0]]) {
      const name = segments[0]
      const args = segments[1].includes(',') ? 
        (segments[1].includes(':') ? segments[1].split(',').reduce((acc, keyValue) => ({...acc, [keyValue.split(':')[0]]: keyValue.split(':')[1]}), {}) : segments[1].split(',')) :
        (segments[1].includes(':') ? [{ [segments[1].split(':')[0]]: segments[1].split(':')[1] }] : [segments[1]])
      methods.push({ name, args })
      segments = segments.slice(2)
    }
    let target = segments

    let data, output, error = undefined

    
    console.log(target)
    const source = target.length > 0 ? 'https://' + target.join('/') : undefined

    let steps = []

    try {
      data = source ? await fetch(source).then(res => res.json()) : [
        { 'user': 'barney',  'age': 36 },
        { 'user': 'fred',    'age': 40 },
        { 'user': 'pebbles', 'age': 1 }
      ]

      for (let method of methods) {
        output = _.chain(data)[method.name]([...method.args]).value()
        steps.push({ method, data: output })
        data = output
      }
      
      
//       tokens = pathSegments.map(segment => esprima.tokenize(segment))
//       scripts = pathSegments.map(segment => esprima.parseScript(segment))

//       matcher = /(?<method>.+)\((?<args>.+)\)/g

//       exec = pathSegments.map(segment => segment.matchAll(matcher))
//         _[pathSegments[0]]()

//       methods = Object.keys(_).reduce((acc, method) => {
//         acc[method] = `https://lodash.do/${method}/:args${pathname}`
//         return acc
//       }, {})
    
    } catch({name,message}) {
      error = {name,message} 
    }

    if (error || pathOptions?.debug) return new Response(JSON.stringify({ api, methods, steps, source, data, output, error, user }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
    return new Response(JSON.stringify({ api, source, methods, output, allMethods, error, user }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
  },
}
