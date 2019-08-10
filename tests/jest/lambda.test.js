/* eslint-env jest */

import nodeUtils from '../utils/node'
import createConfig from '../utils/config'

const config = createConfig()

afterEach(async () => {
  await nodeUtils.disconnectAll()
})

test('execute', async () => {
  const encryptKey = await nodeUtils.newKey(config)
  const handler = jest.fn(() => (new Promise((resolve) => setTimeout(() => resolve({ value: 42 }), 50))))

  const client = nodeUtils.create()
  await client.connect()
  const { key } = await client.keys.approve(encryptKey)

  const { id: contract } = await client.contracts.create(key, { testContract: true })
  await client.contracts.publish(key, contract)
  await client.contracts.subscribe(contract, handler)

  const result = await client.contracts.lambda(key, contract, 'test-lambda 0.0.1', { lambdaParams: true })

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler).toHaveBeenCalledWith('test-lambda 0.0.1', { lambdaParams: true }, key)
  expect(result).toStrictEqual({ value: 42 })
})

test('error', async () => {
  const encryptKey = await nodeUtils.newKey(config)
  const handler = () => {
    throw new Error('Invalid call (test)')
  }

  const client = nodeUtils.create()
  await client.connect()
  const { key } = await client.keys.approve(encryptKey)

  const { id: contract } = await client.contracts.create(key, { testContract: true })
  await client.contracts.publish(key, contract)
  await client.contracts.subscribe(contract, handler)

  let error
  try {
    await client.contracts.lambda(key, contract, 'test-lambda 0.0.1', { lambdaParams: true })
  } catch (e) {
    error = e.message
  }

  expect(error).toBe(`@${contract}/contracts.lambda/test-lambda 0.0.1:Invalid call (test)`)
})
