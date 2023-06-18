import { database } from './database/index.js'

interface RawConfig {
  server_name: string
  root_url: string | null
}

class IsotopeConfig {
  private readonly config: RawConfig
  constructor () {
    try {
      const config = database.prepared_statements.config_read.get() as RawConfig | null
      if (config === null) throw new Error('No existing config')
      this.config = config
    } catch {
      const server_name = prompt('Server name?', 'Isotope') as string
      const root_url = prompt('Root URL')
      const new_config = { server_name, root_url }
      this.config = new_config
      database.prepared_statements.config_create.run({
        $server_name: server_name,
        $root_url: root_url
      })
    }
  }

  get server_name (): string {
    return this.config.server_name
  }

  set server_name (new_server_name) {
    database.prepared_statements.config_update_server_name.run(new_server_name)
  }
}

const config = new IsotopeConfig()
export { config }
