import { models } from '@/models.js'
import { database } from '@/database/index.js'

export interface RawMessage {
  id: string
  group_id: string
  channel_id: string
  author_id: string
  creation_date: number
  content_json: string
}

export class Message {
  id
  group
  channel
  author
  creation_date
  content: {
    text?: string
  }

  constructor (data: RawMessage) {
    this.id = data.id
    this.group = models.get<'Group'>('Group', data.group_id)
    this.channel = models.get<'Channel'>('Channel', data.channel_id)
    this.author = models.get<'User'>('User', data.author_id)
    this.creation_date = new Date(data.creation_date)
    this.content = JSON.parse(data.content_json)
  }

  static from_db (id: string): Message {
    const data: RawMessage = database.prepared_statements.message_read.get(id)
    return new this(data)
  }
}
