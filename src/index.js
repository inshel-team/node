import '@babel/polyfill'

import ContractKeys from './node/contract-keys'
import Contracts from './node/contracts'
import Invites from './node/invites'
import Keys from './node/keys'
import Rays from './node/rays'
import transports from './transports'

class Node {
  static STATUSES = {
    CONNECTED: 'CONNECTED',
    DISCONNECTED: 'DISCONNECTED'
  }

  static EVENTS = {
    connect: Node.STATUSES.CONNECTED,
    disconnect: Node.STATUSES.DISCONNECTED
  }

  constructor (options) {
    this.options = options || {}
    this.status = Node.STATUSES.DISCONNECTED
    this.events = { }

    this.transport = transports(this.options)
    this.contractKeys = new ContractKeys(this)
    this.contracts = new Contracts(this)
    this.invites = new Invites(this)
    this.keys = new Keys(this)
    this.rays = new Rays(this)

    Object.keys(Node.EVENTS).forEach((eventType) => this.transport.on(
      eventType,
      (_, event) => {
        this.status = Node.EVENTS[eventType]
        this.fireEvent(eventType, event)
      }
    ))
  }

  on (eventType, handler) {
    this.events[eventType] = this.events[eventType] || []
    this.events[eventType].push(handler)
  }

  unsubscribe (eventType, handler) {
    this.events[eventType] = this.events[eventType] || []
    this.events[eventType] = this.events[eventType].filter((i) => i !== handler)
  }

  fireEvent (eventType, event) {
    this.events[eventType] = this.events[eventType] || []
    this.events[eventType].forEach((handler) => handler(eventType, event))
  }

  connect () {
    return this.transport.connect()
  }

  disconnect () {
    return this.transport.disconnect()
  }
}

export default Node
