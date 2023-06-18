import { database } from '@/database/index.js'
import { models } from '@/models.js'

export interface RawRole {
  id: string
  group_id: string
  name: string
  creation_date: number
}

export class Role {
  id
  group
  name
  creation_date

  constructor (data: RawRole) {
    this.id = data.id
    this.group = models.get<'Group'>('Group', data.group_id)
    this.name = data.name
    this.creation_date = new Date(data.creation_date)
  }

  static from_db (id: string): Role {
    const data: RawRole = database.prepared_statements.channel_read.get(id)
    return new this(data)
  }
}
