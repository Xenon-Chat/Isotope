import { database } from '@/database/index.js'

export interface RawGroup {
  id: string
  name: string
  creation_date: number
}

export class Group {
  id
  name
  creation_date

  constructor (data: RawGroup) {
    this.id = data.id
    this.name = data.name
    this.creation_date = new Date(data.creation_date)
  }

  static from_db (id: string): Group {
    const data: RawGroup = database.prepared_statements.group_read.get(id)
    return new this(data)
  }
}
