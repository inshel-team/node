/* eslint-env jest */

import Redirect from '../../src/redirect'
import nodeUtils from '../utils/node'
import createConfig from '../utils/config'

const config = createConfig()

afterEach(async () => {
  await nodeUtils.disconnectAll()
})

test('main way', async () => {
  jest.setTimeout(10000)

  const mainContractKey = await nodeUtils.newKey(config)
  const proxyContractKey = await nodeUtils.newKey(config)
  const clientKey = await nodeUtils.newKey(config)

  const mainNode = await nodeUtils.create()
  await mainNode.connect()
  const { key: mainKeyId } = await mainNode.keys.approve(mainContractKey)

  const handler = jest.fn(() => ({ value: 42 }))
  const { id: mainContract } = await mainNode.contracts.create(
    mainKeyId,
    { isTest: true, test: 'pipe.main: main way' }
  )
  await mainNode.contracts.publish(mainKeyId, mainContract)
  mainNode.contracts.subscribe(mainContract, handler)

  const proxyHandler = () => new Redirect({
    contract: mainContract,
    lambda: 'tests.lambda.pipe',
    params: { newParams: true }
  })
  const proxyNode = await nodeUtils.create()
  await proxyNode.connect()
  const { key: proxyKeyId } = await proxyNode.keys.approve(proxyContractKey)

  const { id: proxyContract } = await proxyNode.contracts.create(
    proxyKeyId,
    { isTest: true, test: 'pipe.proxy: main way' }
  )
  await proxyNode.contracts.publish(proxyKeyId, proxyContract)
  proxyNode.contracts.subscribe(proxyContract, proxyHandler)

  const clientNode = await nodeUtils.create()
  await clientNode.connect()
  const { key: clientKeyId } = await clientNode.keys.approve(clientKey)

  const result = await clientNode.contracts.lambda(clientKeyId, proxyContract, 'tests.lambda.proxy', { myAnswer: 42 })

  expect(result).toStrictEqual({ value: 42 })
  expect(handler).toHaveBeenCalledWith('tests.lambda.pipe', { newParams: true }, proxyKeyId)
})
