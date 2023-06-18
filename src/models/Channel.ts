import { database } from '@/database/index.js'
import { models } from '@/models.js'

export interface RawChannel {
  id: string
  group_id: string
  creation_date: number
  permissions_json: string
}

export class Channel {
  id
  group
  creation_date
  permissions: Record<string, unknown>

  constructor (data: RawChannel) {
    this.id = data.id
    this.group = models.get<'Group'>('Group', data.group_id)
    this.creation_date = new Date(data.creation_date)
    this.permissions = JSON.parse(data.permissions_json)
  }

  static from_db (id: string): Channel {
    const data: RawChannel = database.prepared_statements.channel_read.get(id)
    return new this(data)
  }
}
