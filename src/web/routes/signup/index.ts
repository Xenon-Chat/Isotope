
import { type Context } from '@kapsonfire/bun-bakery'

export async function GET (context: Context): Promise<void> {
  context.sendResponse(new Response('index'))
}
