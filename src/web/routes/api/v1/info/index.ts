import { config } from '@/config.js'
import { type Context } from '@kapsonfire/bun-bakery'

export async function GET (context: Context): Promise<void> {
  context.sendResponse(new Response(JSON.stringify({
    version: 1,
    server_name: config.server_name
  })))
}
