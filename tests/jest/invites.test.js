/* eslint-env jest */

import JSEncrypt from 'node-jsencrypt'

import nodeUtils from '../utils/node'
import createConfig from '../utils/config'

const config = createConfig()

afterEach(async () => {
  await nodeUtils.disconnectAll()
})

test('Create invite & create new key with gift', async () => {
  const encryptkey = new JSEncrypt()
  const newkey = new JSEncrypt()
  encryptkey.setPrivateKey(config.nodeKey)

  const client = nodeUtils.create()
  await client.connect()
  const { key, invites } = await client.keys.approve(encryptkey)

  if (invites < 1000) {
    throw new Error('Not enough invites')
  }

  const invite = await client.invites.create(key)
  await client.keys.create(invite, newkey)
  const { key: newKeyId } = await client.keys.approve(newkey)
  await client.invites.give(key, newKeyId, 10)
  await client.disconnect()
  await client.connect()
  const { invites: newKeyInvites } = await client.keys.approve(newkey)

  expect(newKeyInvites).toBe(10)
})
