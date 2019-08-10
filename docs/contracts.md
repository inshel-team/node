# Contracts

Contracts solve routing problems in InShel Network.  
Your can manage your contracts in [exporer.inshel.dev](https://exporer.inshel.dev/#!/contracts)

## Contracts life cycle

Created contract has 'not published' status.  
Contract with this status can also be updated. After publish your can only delete the contract.

## Create contract

```javascript
const newContract = (node, keyId) => {
  const { id, created } = await client.contracts.create(keyId, { readme: 'https://...', myProps: { answer: 42 }, another: '' })

  return id
}
```

## Update contract

```javascript
const updateContract = (node, keyId, contractId, schema) => {
  await client.contracts.update(keyId, contractId, schema)
}
```

## Publish contract

```javascript
const publishContract = (node, keyId, contractId) => {
  await client.contracts.publish(keyId, contractId)
}
```

## Delete contract

```javascript
const deleteContract = (node, keyId, contractId) => {
  await client.contracts.delete(keyId, contractId)
}
```

## Subscribe