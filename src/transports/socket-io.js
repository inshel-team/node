import IOClient from 'socket.io-client'
import uuid from 'uuid'

export class SocketIOTransport {
  static CLOUD_URI = 'https://cloud.inshel.com'

  constructor (options) {
    this.options = options
    this.events = { }
    this._calls = { }

    this.channels = {
      subscribe: (channel, handler) => {
        this.client.on(channel, handler)
      },
      unsubscribe: (channel, handler) => {
        this.client.removeListener(channel, handler)
      }
    }
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
    if (this.client != null) {
      throw new Error('Already connected')
    }

    this.client = IOClient(
      this.options.cloudUri || SocketIOTransport.CLOUD_URI,
      { reconnection: false }
    )
    this.client.on('disconnect', this.disconnect)
    this.client.on('result', ({ id, result, error }) => {
      try {
        const call = this._calls[id]
        if (call == null) {
          throw new Error(`Call "${id}" not found`)
        }
        delete this._calls[id]

        if (error != null) {
          const callDescription = [
            call.contract,
            call.method,
            call.lambda
          ].filter((i) => i != null).join('/')

          return call.reject(new Error(`@${callDescription}:${error}`))
        }

        call.resolve(result)
      } catch (e) {
        this.fireEvent('error', { eventType: 'error', error: e })
      }
    })

    this.fireEvent('connect', { eventType: 'connect' })
  }

  disconnect = () => {
    if (this.client == null) {
      throw new Error('Already disconnected')
    }

    try {
      this.client.disconnect()
    } catch (e) {
    }

    this.client = null
    this.fireEvent('disconnect', { eventType: 'disconnect' })
  }

  execute (method, params) {
    if (this.client == null) {
      throw new Error(`Transport not ready ${method}`)
    }

    const id = uuid.v4()
    return new Promise((resolve, reject) => {
      this._calls[id] = {
        resolve,
        reject,
        contract: params.contract,
        method,
        lambda: params.lambda
      }

      this.client.emit(method, { id, method, params, payload: params })
    })
  }

  lambdaResult (channel, id, result, error) {
    if (error != null) {
      this.client.emit(channel, { id, error })
      return
    }

    this.client.emit(channel, { id, result })
  }

  lambdaRedirect (channel, id, pipe) {
    this.client.emit(channel, { id, pipe })
  }
}

export default (options) => new SocketIOTransport(options)
