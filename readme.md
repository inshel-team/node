# @inshel/node

## Motivation

## InShel Network

About InShel.

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

Delta: pipe, motivation, about

- [InShel Node](./docs/node.md)  
Node supports your connection with InShel Network.

- [Keys](./docs/keys.md)  
InShel network use RSA keys to authorized.  
Your can manage your keys in [exporer.inshel.dev](https://exporer.inshel.dev/#!/keys)

- [Invites](./docs/invites.md)  
InShel Network has closed beta status.  
We use invites to provide access.

- [Contracts](./docs/contracts.md)  
Contracts solves routing problem in InShel Network.  
Your can manage your contracts in [exporer.inshel.dev](https://exporer.inshel.dev/#!/contracts)

- [Contract keys](./docs/contract-keys.md)  
Contract keys allow your clients use InShel Network.  
This keys can execute only his contracts lambda, and can't work with contracts and invites.

- [Rays](./docs/rays.md)  
Rays it's contract event bus.

- [Redirect](./docs/redirect.md)  

## Contribution

Create environment

```bash
mkdir ./environment
touch ./environment/key
touch ./environment/node-key
```

To start tests your must have a valid keys with invites.  

## Changelog

### 0.1.0

First implementation
- node
- keys
- invites
- contracts
- contract-keys
- rays