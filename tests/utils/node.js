import JSEncrypt from 'node-jsencrypt'

import Node from '../../src'

class NodeUtils {
  constructor () {
    this.nodes = []
  }

  invite = async (config) => {
    const encryptkey = new JSEncrypt()
    encryptkey.setPrivateKey(config.nodeKey)

    const client = this.create()
    await client.connect()

    const { key, invites } = await client.keys.approve(encryptkey)
    if (invites < 1000) {
      throw new Error(`Not enough invites: (key:${key})`)
    }

    return client.invites.create(key)
  }

  newKey = async (config) => {
    const newKey = new JSEncrypt()

    const invite = await this.invite(config)
    const client = this.create()
    await client.connect()
    await client.keys.create(invite, newKey)

    return newKey
  }

  create = () => {
    const node = new Node()
    this.nodes.push(node)

    return node
  }

  disconnectAll = async () => {
    while (this.nodes.length > 0) {
      const node = this.nodes.shift()
      if (node.status !== Node.STATUSES.CONNECTED) {
        continue
      }

      await node.disconnect()
    }
  }
}

export default new NodeUtils()
