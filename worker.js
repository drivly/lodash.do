import _ from 'lodash'

export default {
  fetch: async (req) => {
    const { pathname, search } = new URL(req.url)
    const [__, operations, callback] = pathname.split('/')

    console.log({ __, operations, callback })

    const retval = {}

    return new Response(JSON.stringify(retval, null, 2), { headers: { 'content-type': 'application/json' } })
  },
}
