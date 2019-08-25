# Keys

InShel network use RSA keys to authorize nodes.  
Your can manage your keys in [explorer.inshel.dev](https://explorer.inshel.dev/#!/keys)

# Create new key

You must have an invite to create new key.  

*It's important to be open to new ideas. We're always interested in collaboration and developement.  
Contact us if you need InShel Platform for your purposes or have any other questions.
[contact@inshel.com](mailto:contact@inshel.com)*

```javascript
import Node from '@inshel/node'
import JSEncrypt from 'jsencrypt'
// import JSEncrypt from 'node-jsencrypt'

const newKey = async (invite) => {
  const key = new JSEncrypt()
  const client = await nodeUtils.create()
  await client.connect()

  await client.keys.create(invite, key)
}
```

# Approve

Have a key - prove it.

**Actors**

- Client node - Alice
- InShel Network - InShel Network

**Scenario**

1. Alice calls InShel Network to approve the key
2. InShel Network checks key and returns a challenge
3. Alice uses private key to resolve challenge
4. Alice informs InShel Network about that resolve

```javascript
import Node from '@inshel/node'
import JSEncrypt from 'jsencrypt'
// import JSEncrypt from 'node-jsencrypt'

const approve = async (key) => {
  const node = new Node()
  await node.connect()

  await node.keys.approve(key)
  return node
}
```