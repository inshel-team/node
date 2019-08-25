# @inshel/node

## Motivation

Our motivation was to create a message broker for microservices,
with the simplest connection possible.

We pay special attention to the environments from which you can access the network:
IS Network works not only on server, but also in browser tabs, mobile applications, applications on the router.

## InShel Network

IS Network is an api-oriented virtual network.
For identification in the network [IS Keys](./docs/keys.md) are used.
To provide access to resources, the [concept of contracts](./docs/contracts.md) is used.

## Install

```bash
npm install --save @inshel/node
```

## Connect

```javascript
import Node from '@inshel/node'

const connect = async () => {
  const node = new Node()
  await node.connect()
}
```

## Docs

- [InShel Node](./docs/node.md)  
Node supports your connection with InShel Network.

- [Keys](./docs/keys.md)  
InShel network use RSA keys to authorize nodes.  
Your can manage your keys in [explorer.inshel.dev](https://explorer.inshel.dev/#!/keys)

- [Invites](./docs/invites.md)  
InShel Network has closed beta status.  
We use invites to provide access.

- [Contracts](./docs/contracts.md)  
Contracts solve routing problem in InShel Network.  
Your can manage your contracts in [explorer.inshel.dev](https://explorer.inshel.dev/#!/contracts)

- [Contract keys](./docs/contract-keys.md)  
Contract keys allow your clients use InShel Network.  
This keys can execute strict only its contracts lambda and can't work with other contracts and invites.

- [Rays](./docs/rays.md)  
Ray is a contracts event bus.

- [Redirect](./docs/redirect.md)  
IS Network allow redirect lambda execution.

## Contribution

Create environment

```bash
mkdir ./environment
touch ./environment/key
touch ./environment/node-key
```

To start tests your must have valid keys with invites.  

## Changelog

- fix docs
  - readme.md
  - docs/contracts.md
  - docs/keys.md
  - docs/rays.md 

### 0.1.0

First implementation
- node
- keys
- invites
- contracts
- contract-keys
- rays