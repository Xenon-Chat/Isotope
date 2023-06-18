import { database } from '@/database/index.js'
import { models } from '@/models.js'

export interface RawUser {
  id: string
  login: string
  token: string
  name: string
  creation_date: number
  is_admin: number
  is_bot: number
  owner: string | null
}

export class User {
  id
  token
  name
  creation_date
  is_admin
  is_bot
  owner?: User

  constructor (data: RawUser) {
    this.id = data.id
    this.token = data.token
    this.name = data.name
    this.creation_date = new Date(data.creation_date)
    this.is_admin = data.is_admin === 1
    this.is_bot = data.is_bot === 1
    if (data.owner !== null) this.owner = models.get<'User'>('User', data.owner)
  }

  static from_db (id: string): User {
    const data: RawUser = database.prepared_statements.user_read.get(id)
    return new this(data)
  }
}
