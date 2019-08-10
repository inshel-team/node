const BAN_COMMAND = 'contracts.ban'
const SIGN_UP_COMMAND = 'contracts.sign-up'
const UNBAN_COMMAND = 'contracts.unban'

class ContractKeys {
  constructor (node) {
    this.node = node
  }

  ban (contract, key) {
    return this.node.transport.execute(
      BAN_COMMAND,
      { contract, key }
    )
  }

  unban (contract, key) {
    return this.node.transport.execute(
      UNBAN_COMMAND,
      { contract, key }
    )
  }

  signUp (contract, publicKey, params) {
    return this.node.transport.execute(
      SIGN_UP_COMMAND,
      { contract, public: publicKey, params }
    )
  }
}

export default ContractKeys
