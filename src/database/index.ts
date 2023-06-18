import { Database } from 'bun:sqlite'
import { run_migrations } from '@/database/migrations.js'

class IsotopeDatabase {
  db: Database
  metadata: {
    version: number
  }

  prepared_statements

  constructor () {
    this.db = new Database('isotope.sqlite', { create: true })
    run_migrations(this)

    this.prepared_statements = {
      get_metadata: this.db.prepare('SELECT * FROM "meta"'),
      config_create: this.db.prepare(`
        INSERT INTO "config"
        VALUES (
          $server_name,
          $root_url
        )
      `),
      config_read: this.db.prepare('SELECT * FROM "config"'),
      config_update_all: this.db.prepare(`
        UPDATE "config"
        SET
          server_name = $server_name,
          root_url = $root_url
      `),
      config_update_server_name: this.db.prepare('UPDATE "config" SET server_name = ?'),
      config_update_root_url: this.db.prepare('UPDATE "config" SET root_url = ?'),
      user_read: this.db.prepare('SELECT * FROM "user" WHERE id = ?'),
      user_id_from_token: this.db.prepare('SELECT id FROM "user" WHERE id = (SELECT user_id FROM "login" WHERE token = ?)'),
      group_read: this.db.prepare('SELECT * FROM "group" WHERE id = ?'),
      role_read: this.db.prepare('SELECT * FROM "role" WHERE id = ?'),
      channel_read: this.db.prepare('SELECT * FROM "channel" WHERE id = ?'),
      message_read: this.db.prepare('SELECT * FROM "message" WHERE id = ?')
    }

    this.metadata = this.prepared_statements.get_metadata.get()
  }
}

const database = new IsotopeDatabase()
export { database, type IsotopeDatabase }
