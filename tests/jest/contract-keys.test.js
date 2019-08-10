/* eslint-env jest */

import JSEncrypt from 'node-jsencrypt'

import nodeUtils from '../utils/node'
import createConfig from '../utils/config'

const config = createConfig()

afterEach(async () => {
  await nodeUtils.disconnectAll()
})

test('sign-up', async () => {
  const encryptKey = await nodeUtils.newKey(config)
  const newKey = new JSEncrypt()
  const handler = jest.fn(() => true)

  const client = nodeUtils.create()
  await client.connect()
  const { key } = await client.keys.approve(encryptKey)

  const { id: contract } = await client.contracts.create(key, { testContract: true })
  await client.contracts.publish(key, contract)
  await client.contracts.subscribe(contract, handler)

  const result = await client.contractKeys.signUp(contract, newKey.getPublicKey(), { name: 'Joe' })

  expect(handler).toHaveBeenCalledTimes(1)
  expect(result.key).toBeDefined()
})

test('ban', async () => {
  const encryptKey = await nodeUtils.newKey(config)
  const newKey = new JSEncrypt()
  const handler = jest.fn(() => true)

  const client = nodeUtils.create()
  await client.connect()
  const { key } = await client.keys.approve(encryptKey)

  const { id: contract } = await client.contracts.create(key, { testContract: true })
  await client.contracts.publish(key, contract)
  await client.contracts.subscribe(contract, handler)

  const result = await client.contractKeys.signUp(contract, newKey.getPublicKey(), { name: 'Joe' })
  await client.contractKeys.ban(contract, result.key)
})

test('unban', async () => {
  const encryptKey = await nodeUtils.newKey(config)
  const newKey = new JSEncrypt()
  const handler = jest.fn(() => true)

  const client = nodeUtils.create()
  await client.connect()
  const { key } = await client.keys.approve(encryptKey)

  const { id: contract } = await client.contracts.create(key, { testContract: true })
  await client.contracts.publish(key, contract)
  await client.contracts.subscribe(contract, handler)

  const result = await client.contractKeys.signUp(contract, newKey.getPublicKey(), { name: 'Joe' })
  await client.contractKeys.ban(contract, result.key)
  await client.contractKeys.unban(contract, result.key)
})
