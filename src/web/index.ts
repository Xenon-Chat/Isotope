import { Router, type Context } from '@kapsonfire/bun-bakery'
import path from 'path'

import { type User } from '@/models/User.js'
import { database } from '@/database/index.js'
import { models } from '@/models.js'
import { assert_is_error } from '@/util.js'

const http_port = Number(process.env.PORT ?? 15070)

class IsotopeWeb {
  router: Router

  constructor () {
    console.log(`Initializing web server on port ${http_port}`)
    this.router = new Router({
      assetsPath: path.join(import.meta.dir, 'static'), // eslint-disable-line @typescript-eslint/naming-convention
      routesPath: path.join(import.meta.dir, 'routes'), // eslint-disable-line @typescript-eslint/naming-convention
      port: http_port
    })
  }

  authenticated_endpoint (callback: (user: User, context: Context) => unknown) {
    return async (context: Context) => {
      const get_user = async (): Promise<User> => {
        const token = context.headers.get('X-Token')
        if (typeof token !== 'string') throw new Error('Specify an X-Token')

        try {
          const user_id = database.prepared_statements.user_id_from_token.get(token) as string
          const user = models.get<'User'>('User', user_id)
          return user
        } catch {
          throw new Error('Invalid token')
        }
      }

      try {
        const user = await get_user()
        await callback(user, context)
      } catch (error_unknown) {
        const error = assert_is_error(error_unknown)
        context.send(JSON.stringify({
          error: error.message
        }))
      }
    }
  }

  async render_view (view: string, data?: any): Promise<string> {
    return await new Promise((resolve, reject) => {
      resolve('a')
    })
  }
}

const web = new IsotopeWeb()
export { web }
