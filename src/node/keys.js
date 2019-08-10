const CHALLENGE_COMMAND = 'keys.challenge'
const CHALLENGE_SOLVE_COMMAND = 'keys.solveChallenge'
const CREATE_COMMAND = 'keys.create'

class Keys {
  constructor (node) {
    this.node = node
  }

  async approve (key) {
    const challenge = await this.challenge(key.getPublicKey())
    return this.challengeSolve(key, challenge)
  }

  async challenge (publicKey) {
    const { challenge } = await this.node.transport.execute(
      CHALLENGE_COMMAND,
      { public: publicKey }
    )

    return challenge
  }

  async challengeSolve (key, challenge) {
    const result = await this.node.transport.execute(
      CHALLENGE_SOLVE_COMMAND,
      { challenge, solve: key.decrypt(challenge) }
    )

    return result
  }

  async create (invite, key) {
    await this.node.transport.execute(
      CREATE_COMMAND,
      { invite, public: key.getPublicKey() }
    )
  }
}

export default Keys
