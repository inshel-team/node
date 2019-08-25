# Contracts

Contracts solve routing problems in InShel Network.  
Your can manage your contracts in [explorer.inshel.dev](https://explorer.inshel.dev/#!/contracts)

## Contracts life cycle

Created contract has 'not published' status.  
Contract with this status can also be updated. After publish your can only delete the contract.

## Create contract

Create new unpublished contract.  
Unpublished contracts can be called only with the owner key.  

```javascript
const newContract = (node, keyId) => {
  const { id, created } = await client.contracts.create(
    keyId, 
    { readme: 'https://...', myProps: { answer: 42 }, another: '' }
  )

  return id
}
```

## Update contract

Create your contract.  
Only unpublished contracts can be updated.

```javascript
const updateContract = (node, keyId, contractId, schema) => {
  await client.contracts.update(keyId, contractId, schema)
}
```

## Publish contract

Publish contract.

```javascript
const publishContract = (node, keyId, contractId) => {
  await client.contracts.publish(keyId, contractId)
}
```

## Delete contract

Delete contract.

```javascript
const deleteContract = (node, keyId, contractId) => {
  await client.contracts.delete(keyId, contractId)
}
```

## Subscribe and execute lambda

### Contract node

```javascript
const subscribePongContract = (node, keyId, contractId) => {
  await client.contracts.subscribe(contract, (lambda, params, keyId) => 'pong')
}
```

### Client node

```javascript
const executeLambda = (node, keyId, contractId, lambdaName, lambdaParams) => {
  const result = await client.contracts.lambda(
    keyId, 
    contractId, 
    lambdaName, 
    lambdaParams
  )

  return result
}
```