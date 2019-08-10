import Redirect from '../redirect'

const LAMBDA_COMMAND = 'contracts.lambda'
const CREATE_COMMAND = 'contracts.create'
const UPDATE_COMMAND = 'contracts.update'
const DELETE_COMMAND = 'contracts.delete'
const PUBLISH_COMMAND = 'contracts.publish'
const SUBSCRIBE_COMMAND = 'contracts.subscribe'

class Contracts {
  constructor (node) {
    this.node = node
  }

  create (key, schema) {
    return this.node.transport.execute(
      CREATE_COMMAND,
      { key, schema }
    )
  }

  update (key, contract, schema) {
    return this.node.transport.execute(
      UPDATE_COMMAND,
      { key, id: contract, schema }
    )
  }

  publish (key, contract) {
    return this.node.transport.execute(
      PUBLISH_COMMAND,
      { key, id: contract }
    )
  }

  delete (key, contract) {
    return this.node.transport.execute(DELETE_COMMAND, { key, id: contract })
  }

  async subscribe (contract, handler) {
    const { channel } = await this.node.transport.execute(SUBSCRIBE_COMMAND, { id: contract })
    if (handler.inshelHandler == null) {
      handler.inshelHandler = async ({ lambda, key, params, id }) => {
        try {
          const result = await handler(lambda, params, key)

          if (result instanceof Redirect) {
            this.node.transport.lambdaRedirect(channel, id, result.pipe)
            return
          }

          this.node.transport.lambdaResult(channel, id, result)
        } catch (e) {
          this.node.fireEvent('error', e)
          this.node.transport.lambdaResult(channel, id, null, e.message || 'Unhandled error')
        }
      }
    }

    this.node.transport.channels.subscribe(channel, handler.inshelHandler)
  }

  lambda (key, contract, lambda, params) {
    return this.node.transport.execute(
      LAMBDA_COMMAND,
      {
        key,
        contract,
        lambda,
        params
      }
    )
  }
}

export default Contracts
