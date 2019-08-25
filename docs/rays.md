# Rays

Ray is basically contracts event bus.

# Subscribe

**Actors**

- Client node - Alice
- Contract node - Bob
- InShel Network - IS Network

**Scenario**

1. Client calls IS Network to subscribe contract rays
2. IS Network executes lambda "rays.subscribe" in contract
3. Bob returns Array of [true (approve subscibe) or anything other as an error]
4. IS Network returns result to Alice

## Contract node

```javascript
const subscribeContract = (node, keyId, contractId) => {
  await client.contracts.subscribe(contract, (lambda, params, keyId) => {
    switch (lambda) {
      CASE 'rays.subscribe':
        const { rays } = params

        return rays.map(() => true)
    }
  })
}
```

## Client node

```javascript
const raysSubscribe = (key, contract, ray) => {
  await node.rays.subscribe(key, { contract, ray }, (contract, ray, message) => {
    console.log(`Contract:${contract}\nRay:${ray}\nMessage:${message}`)
  })
}
```

# Unsubscribe

```javascript
const raysSubscribe = (key, contract, ray, handler) => {
  await node.rays.subscribe(key, { contract, ray }, handler)
}
```