# Contract keys

Contract keys allow your clients use InShel Network.  
These keys can execute only their contracts lambda and can't work with other contracts and invites.

## Create new contract key

**Actors**
- Client node - Alice
- Contract node - Bob

**Scenario**
1. Alice generates a new RSA key and calls InShel Network to execute "contract.signup" command with arguments: contract id, public key and any params.
2. InShel Network calls Bob to execute lambda "contracts.sign-up".
3. If Bob returned true as a lambda result, InShel Network registers new key.
4. If Bob returned something different from true, InShel Network returns this value as error to Alice.

### Client node

```javascript
const contractId = -1

const signUp = async (node, key, params) => {
  await node.contractKeys.signUp(
    contractId, 
    key.getPublicKey(), 
    params
  )
  const { key } = await node.keys.approve(key)

  return key
}
```

### Contract node

```javascript
const start = (node, contract) => {
  node.contracts.subscribe(contract, async (lambda, params) => {
    switch (lambda) {
      case 'contracts.sign-up':
        if (params.name == null) {
          return 'Error: name required'
        }

        return true
    }
  })
}
```

## Manage your contract keys

Node must be subscribed to contract to use these methods.

### Ban

```javascript
const onBan = async (node, { contract, keyId }) => {
  await node.contractKeys.ban(contract, keyId)
} 
```

### Unan

```javascript
const onUnban = async (node, { contract, keyId }) => {
  await node.contractKeys.unban(contract, keyId)
} 
```