import { Channel } from '@/models/Channel.js'
import { Group } from '@/models/Group.js'
import { Message } from '@/models/Message.js'
import { Role } from '@/models/Role.js'
import { User } from '@/models/User.js'

const MODELS = {
  Channel,
  Group,
  Message,
  Role,
  User
}

class ModelMap {
  private readonly map: Map<string, any>
  constructor () {
    this.map = new Map()
  }

  get<T extends keyof typeof MODELS>(model_name: T, id: string): InstanceType<typeof MODELS[T]> {
    return this.map.get(id) ?? MODELS[model_name].from_db(id)
  }
}

const models = new ModelMap()
export { models }
