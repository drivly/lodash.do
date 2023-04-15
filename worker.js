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
      const name = segments[0]
      const requiredArgCount =
        (_[name] || '')
          .toString()
          .match(/\((.*)\)/)[0]
          .replace(/\(|\)/g, '')
          .split(',')
          .filter((arg) => arg !== '').length - 1

      let args = []
      if (requiredArgCount) {
        args = segments[1].split(',')
        if (segments[1].includes(':')) { // Parse predicate args for filter, find, etc.
          args = [args.reduce((acc, keyValue) => {
            const [key, value] = keyValue.split(':')
            return { ...acc, [key]: value }
          }, {})]
        }
      }

      methods.push({ name, args })
      segments = segments.slice(requiredArgCount ? 2 : 1)
    }

    let steps = [], data, output, error
    const source = segments.length > 0 ? 'https://' + segments.join('/') + search : undefined
    console.log({ methods: JSON.stringify(methods), source })
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
    const allMethods = Object.keys(_)
    return json({ api, methods, steps, source, output, error, allMethods, user })
  },
}

function pipeline(methods, data, steps) {
  for (let method of methods) {
    data = _[method.name](data, ...method.args)
    steps?.push({ method, data })
  }
  return data
}

function json(body, init) {
  return new Response(JSON.stringify(body, null, 2), { ...init, headers: { 'content-type': 'application/json; charset=utf-8' } })
}
