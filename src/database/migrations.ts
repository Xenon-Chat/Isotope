import { assert_is_error } from '@/util.js'
import type { IsotopeDatabase } from '@/database/index.js'

export function run_migrations (database: IsotopeDatabase): void {
  const migrations = migrations_factory(database)

  while (true) {
    const version = get_db_version(database)
    if (version === -1) {
      console.log('Initializing fresh database')
      initialize_fresh_db(database)
      continue
    }

    const migration = migrations[`migrate_${version}`]
    if (migration === undefined) break

    console.log(`Running migration for db version ${version}`)
    migration()
  }
}

function get_db_version (database: IsotopeDatabase): number {
  try {
    const meta_rows = database.db.query('SELECT version FROM "meta"').all()
    if (meta_rows.length !== 1) throw new Error('Database must include exactly one metadata row.')
    const metadata = meta_rows[0]
    return metadata.version
  } catch (unknownError) {
    const error = assert_is_error(unknownError)
    if (error.message === 'no such table: meta') return -1
    throw error
  }
}

function initialize_fresh_db (database: IsotopeDatabase): void {
  database.db.run(`
    CREATE TABLE "meta" (
      "version" INTEGER NOT NULL,
      "creation_date" INTEGER NOT NULL
    )
  `)
  database.db.run('INSERT INTO "meta" VALUES (2, $creation_date)', { $creation_date: (new Date()).getTime() })

  database.db.run(`
    CREATE TABLE "config" (
      "server_name" TEXT NOT NULL,
      "root_url" TEXT
    )
  `)

  database.db.run(`
    CREATE TABLE "user" (
      "id" TEXT NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "creation_date" INTEGER NOT NULL,
      "is_admin" INTEGER DEFAULT 0,
      "is_bot" INTEGER DEFAULT 0,
      "owner" TEXT,
      PRIMARY KEY("id")
    )
  `)

  database.db.run(`
    CREATE TABLE "login" (
      "user_id" TEXT NOT NULL UNIQUE,
      "login" TEXT NOT NULL UNIQUE,
      "password_hash" TEXT NOT NULL,
      "token" TEXT NOT NULL,
      PRIMARY KEY("login")
    )
  `)

  database.db.run(`
    CREATE TABLE "group" (
      "id" TEXT NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "creation_date" INTEGER NOT NULL,
      PRIMARY KEY("id")
    )
  `)

  database.db.run(`
    CREATE TABLE "role" (
      "id" TEXT NOT NULL UNIQUE,
      "group_id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "creation_date" INTEGER NOT NULL,
      PRIMARY KEY("id")
    )
  `)

  database.db.run(`
    CREATE TABLE "group_user_role" (
      "group_id" TEXT NOT NULL,
      "user_id" TEXT NOT NULL,
      "role_id" TEXT NOT NULL,
      "creation_date" INTEGER NOT NULL,
      PRIMARY KEY("group_id", "user_id", "role_id")
    )
  `)

  database.db.run(`
    CREATE TABLE "channel" (
      "id" TEXT NOT NULL UNIQUE,
      "group_id" TEXT NOT NULL,
      "creation_date" INTEGER NOT NULL,
      "permissions_json" TEXT NOT NULL,
      PRIMARY KEY("id")
    )
  `)

  database.db.run(`
    CREATE TABLE "message" (
      "id" TEXT NOT NULL UNIQUE,
      "group_id" TEXT NOT NULL,
      "channel_id" TEXT NOT NULL,
      "author_id" TEXT NOT NULL,
      "creation_date" INTEGER NOT NULL,
      "content_json" TEXT NOT NULL,
      PRIMARY KEY("id")
    )
  `)

  database.db.run(`
    CREATE INDEX "channel_by_group"
    ON "channel" ("group_id")
  `)

  database.db.run(`
    CREATE INDEX "message_by_group"
    ON "message" ("group_id")
  `)

  database.db.run(`
    CREATE INDEX "message_by_channel"
    ON "message" ("channel_id")
  `)
}

function migrations_factory (database: IsotopeDatabase): Record<string, () => unknown | undefined> {
  return {
    // Initial migration for testing migration system
    migrate_0 () {
      database.db.run('UPDATE "meta" SET version = 1')
    },

    // Similar for this one
    migrate_1 () {
      database.db.run('UPDATE "meta" SET version = 2')
    }
  }
}
