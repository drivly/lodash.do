import _ from 'lodash'

export default {
  fetch: async (req) => {
    let { pathname, search, protocol } = new URL(req.url)
    let p = pathname.substring(1).split('/').reverse()
    const operation = p.pop()
    pathname = pathname.substring(operation.length + 1)
    console.log({ operation, pathname, search, url: protocol + '/' + pathname + search })

    const data = await fetch(protocol + '/' + pathname + search, req).then((res) => res.json())

    const retval = { data }

    return new Response(JSON.stringify(retval, null, 2), { headers: { 'content-type': 'application/json' } })
  },
}
