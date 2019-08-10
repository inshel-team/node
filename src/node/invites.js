const CREATE_COMMAND = 'invites.create'
const GIVE_COMMAND = 'invites.give'

class Invites {
  constructor (node) {
    this.node = node
  }

  async create (key) {
    const { invite } = await this.node.transport.execute(
      CREATE_COMMAND,
      { key }
    )

    return invite
  }

  give (key, recipient, count) {
    return this.node.transport.execute(
      GIVE_COMMAND,
      { key, recipient, count }
    )
  }
}

export default Invites
