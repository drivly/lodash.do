import _ from 'lodash'

export const api = {
  icon: '⚡️',
  name: 'lodash.do',
  description: 'Chainable Lodash API',
  url: 'https://lodash.do/api',
  type: 'https://apis.do/transformation',
  endpoints: {
    list: 'https://lodash.do/list',
    _: 'https://lodash.do/:method/:args/:url',
  },
  site: 'https://lodash.do',
  login: 'https://lodash.do/login',
  signup: 'https://lodash.do/signup',
  repo: 'https://github.com/drivly/lodash.do',
}

export const examples = {
  getRandomNorthwindCustomer: 'https://lodash.do/get/Customer/sample/c/json.fyi/northwind.json',
  mapContactNameFromNorthwindCustomers: 'https://lodash.do/get/Customer/map/contactName/json.fyi/northwind.json',
  chunkData: 'https://lodash.do/chunk/2',
}

export default {
  fetch: async (req, env) => {
    const { user, pathSegments, search, rootPath } = await env.CTX.fetch(req).then((res) => res.json())
    if (rootPath) return json({ api, examples, user })

    let methods = [], segments = pathSegments
    while (_[segments[0]]) {
      const [name, argString] = segments
      const requiredArgCount = (_[name] || '').toString()
        .match(/\((.*)\)/)[0]
        .replace(/\(|\)/g, '')
        .split(',')
        .filter((arg) => arg !== '').length - 1
      methods.push({ name, args: requiredArgCount ? extractArgs(argString) : [] })
      segments = segments.slice(requiredArgCount ? 2 : 1)
    }

    let steps = [], data, output, error
    const source = segments.length > 0 ? 'https://' + segments.join('/') + search : undefined
    try {
      data = source ? await fetch(source).then((res) => res.json()) : [
        { user: 'barney', age: 36 },
        { user: 'fred', age: 40 },
        { user: 'pebbles', age: 1 },
      ]
      output = pipeline(methods, data, steps)
      if (output) return json(output)
    } catch ({ name, message }) {
      error = { name, message }
    }

    if (error) return json({ api, methods, steps, source, data, output, error, user })
    return json({ api, methods, steps, source, output, error, allMethods: Object.keys(_), user })
  },
}

function extractArgs(argString) {
  const methodPattern = /\.?([A-ZA-z]+)\(([^()]*)\)/g
  let args = []
  let methodTokens = [...argString.matchAll(methodPattern)]
  if (methodTokens.length) {
    const chain = []
    for (const match of methodTokens) {
      const [method, name, arg] = match
      argString = argString.replace(method, '')
      chain.push({ name, args: arg ? extractArgs(arg) : [] })
    }
    const enclosingMethodTokens = [...argString.matchAll(methodPattern)]
    if (enclosingMethodTokens.length) {
      const [, name] = enclosingMethodTokens[0]
      args.push({ name, args: chain })
    } else args.push({ arg: argString, chain })
  } else {
    args = argString.split(',')
    if (argString.includes(':')) { // Parse predicate args for filter, find, etc.
      args = [args.reduce((acc, keyValue) => {
        const [key, value] = keyValue.split(':')
        return { ...acc, [key]: value }
      }, {})]
    }
  }
  return args
}

function pipeline(methods, data, steps) {
  for (let method of methods) {
    if (method.args.length === 1 && method.args[0].chain) {
      const { arg, chain } = method.args[0]
      data = _[method.name](data, (item) => pipeline(chain, arg !== '' && _.get(item, arg) || item))
    } else if (method.args.length === 1 && method.args[0].name) {
      const { args, name } = method.args[0]
      data = _[method.name](data, (item) => _[name](item, (arg) => pipeline(args, arg)))
    } else data = _[method.name](data, ...method.args)

    steps?.push({ method, data })
  }
  return data
}

function json(body, init) {
  return new Response(JSON.stringify(body, null, 2), { ...init, headers: { 'content-type': 'application/json; charset=utf-8' } })
}
