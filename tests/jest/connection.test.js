/* eslint-env jest */

import Node from '../../src'
import nodeUtils from '../utils/node'

afterEach(async () => {
  await nodeUtils.disconnectAll()
})

test('Connect', async () => {
  const client = nodeUtils.create()
  await client.connect()

  expect(client.status).toBe(Node.STATUSES.CONNECTED)
})

test('Disconnect', async () => {
  const client = nodeUtils.create()
  await client.connect()
  await client.disconnect()

  expect(client.status).toBe(Node.STATUSES.DISCONNECTED)
})

/* Events */
test('Event "connect"', async () => {
  const handler = jest.fn()

  const client = nodeUtils.create()
  client.on('connect', handler)
  await client.connect()

  expect(handler.mock.calls.length).toBe(1)
})

test('Event "disconnect"', async () => {
  const handler = jest.fn()

  const client = nodeUtils.create()
  client.on('disconnect', handler)
  await client.connect()
  await client.disconnect()

  expect(handler.mock.calls.length).toBe(1)
})
