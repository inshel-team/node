const MESSAGE_COMMAND = 'rays.message'
const SUBSCRIBE_COMMAND = 'rays.subscribe'

class Rays {
  constructor (node) {
    this.node = node

    this.rays = {}
  }

  async subscribe (key, _rays, handler) {
    const rays = Array.isArray(_rays) ? _rays : [_rays]

    const result = await Promise.all(rays.map(async ({ contract, ray }) => {
      const rayId = `${contract}:${ray}`

      if (this.rays[rayId] == null) {
        this.rays[rayId] = {
          key,
          contract,
          ray: rayId,
          transportHandler: this.onRayMessage.bind(this, rayId, contract, ray),
          handlers: []
        }

        const result = await this.node.transport.execute(SUBSCRIBE_COMMAND, { key, contract, rays: [ray] })
        if (!Array.isArray(result) || result.length !== 1 || result[0] !== true) {
          throw new Error(`Subscribe error\n${JSON.stringify(result)}`)
        }

        this.node.transport.channels.subscribe(`ray:${rayId}`, this.rays[rayId].transportHandler)
      }

      this.rays[rayId].handlers.push(handler)
      return true
    }))

    return Array.isArray(_rays) ? result : result[0]
  }

  async unsubscribe (key, _rays, handler) {
    const rays = Array.isArray(_rays) ? _rays : [_rays]

    const result = await Promise.all(rays.map(async ({ contract, ray }) => {
      const rayId = `${contract}:${ray}`

      if (this.rays[rayId] == null) {
        return true
      }

      this.rays[rayId].handlers = this.rays[rayId].handlers.filter((i) => i !== handler)

      if (this.rays[rayId].handlers.length === 0) {
        this.node.transport.channels.unsubscribe(`ray:${rayId}`, this.rays[rayId].transportHandler)
      }

      return true
    }))

    return Array.isArray(_rays) ? result : result[0]
  }

  message (key, contract, ray, message) {
    return this.node.transport.execute(MESSAGE_COMMAND, { key, contract, ray, message })
  }

  onRayMessage (rayId, contract, ray, message) {
    if (this.rays[rayId] == null) {
      return
    }

    this.rays[rayId].handlers.forEach((fn) => fn(contract, ray, message))
  }
}

export default Rays
