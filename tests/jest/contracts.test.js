/* eslint-env jest */

import nodeUtils from '../utils/node'
import createConfig from '../utils/config'

const config = createConfig()

afterEach(async () => {
  await nodeUtils.disconnectAll()
})

test('Create', async () => {
  const encryptKey = await nodeUtils.newKey(config)

  const client = nodeUtils.create()
  await client.connect()
  const { key } = await client.keys.approve(encryptKey)

  const contract = await client.contracts.create(key, { testContract: true })

  expect(contract.id).toBeDefined()
  expect(contract.created).toBeDefined()
})

test('Update', async () => {
  const encryptKey = await nodeUtils.newKey(config)

  const client = nodeUtils.create()
  await client.connect()
  const { key } = await client.keys.approve(encryptKey)

  const contract = await client.contracts.create(key, { testContract: true })
  const { updated } = await client.contracts.update(key, contract.id, { testContract2: true })

  expect(updated).toBeDefined()
})

test('Publish', async () => {
  const encryptKey = await nodeUtils.newKey(config)

  const client = nodeUtils.create()
  await client.connect()
  const { key } = await client.keys.approve(encryptKey)

  const contract = await client.contracts.create(key, { testContract: true })
  const { published } = await client.contracts.publish(key, contract.id)

  expect(published).toBeDefined()
})

test('Delete', async () => {
  const encryptKey = await nodeUtils.newKey(config)

  const client = nodeUtils.create()
  await client.connect()
  const { key } = await client.keys.approve(encryptKey)

  const contract = await client.contracts.create(key, { testContract: true })
  const { deleted } = await client.contracts.delete(key, contract.id)

  expect(deleted).toBeDefined()
})
