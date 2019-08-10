/* eslint-env jest */

import nodeUtils from '../utils/node'
import createConfig from '../utils/config'

const config = createConfig()

afterEach(async () => {
  await nodeUtils.disconnectAll()
})

test('Subscribe', async () => {
  const encryptKey = await nodeUtils.newKey(config)
  const handler = jest.fn(() => [true])
  const rayHandler = jest.fn()

  const client = nodeUtils.create()
  await client.connect()
  const { key } = await client.keys.approve(encryptKey)

  const { id: contract } = await client.contracts.create(key, { testContract: true })
  await client.contracts.publish(key, contract)
  await client.contracts.subscribe(contract, handler)

  const result = await client.rays.subscribe(key, { contract, ray: 'ray-name' }, rayHandler)

  expect(result).toBe(true)
})

test('Message', async () => {
  const encryptKey = await nodeUtils.newKey(config)
  const handler = jest.fn(() => [true])
  const rayHandler = jest.fn()

  const client = nodeUtils.create()
  await client.connect()
  const { key } = await client.keys.approve(encryptKey)

  const { id: contract } = await client.contracts.create(key, { testContract: true })
  await client.contracts.publish(key, contract)
  await client.contracts.subscribe(contract, handler)

  await client.rays.subscribe(key, { contract, ray: 'ray-name' }, rayHandler)
  await client.rays.message(key, contract, 'ray-name', 'TEST MESSAGE 42')

  await new Promise((resolve) => setTimeout(resolve, 500))

  expect(rayHandler).toHaveBeenCalledTimes(1)
  expect(rayHandler).toHaveBeenCalledWith(contract, 'ray-name', 'TEST MESSAGE 42')
})

test('Unsubscribe', async () => {
  const encryptKey = await nodeUtils.newKey(config)
  const handler = jest.fn(() => [true])
  const rayHandler = jest.fn()

  const client = nodeUtils.create()
  await client.connect()
  const { key } = await client.keys.approve(encryptKey)

  const { id: contract } = await client.contracts.create(key, { testContract: true })
  await client.contracts.publish(key, contract)
  await client.contracts.subscribe(contract, handler)

  await client.rays.subscribe(key, { contract, ray: 'ray-name' }, rayHandler)
  await client.rays.unsubscribe(key, { contract, ray: 'ray-name' }, rayHandler)
  await client.rays.message(key, contract, 'ray-name', 'TEST MESSAGE 42')

  await new Promise((resolve) => setTimeout(resolve, 500))

  expect(rayHandler).toHaveBeenCalledTimes(0)
})
