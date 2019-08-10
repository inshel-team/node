/* eslint-env jest */

import JSEncrypt from 'node-jsencrypt'

import nodeUtils from '../utils/node'
import createConfig from '../utils/config'

const config = createConfig()

afterEach(async () => {
  await nodeUtils.disconnectAll()
})

test('Approve (node-jsencrypt)', async () => {
  const key = new JSEncrypt()
  key.setPrivateKey(config.key)

  const client = nodeUtils.create()
  await client.connect()
  const result = await client.keys.approve(key)

  expect(result.key).toBeDefined()
  expect(result.invites).toBeDefined()
  expect(result.contract).toBeNull()
})

test('Create new key', async () => {
  const key = new JSEncrypt()

  const invite = await nodeUtils.invite(config)
  const client = await nodeUtils.create()
  await client.connect()

  await client.keys.create(invite, key)
})
