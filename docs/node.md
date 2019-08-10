# InShel Node

Node supports your connection with InShel Network.

## Constructor

```javascript
import Node from '@inshel/node'

const node = new Node()
```

## Connect & disconnect

```javascript
import Node from '@inshel/node'

const myFn = async () => {
  const node = new Node()
  await node.connect()

  // Do something

  await node.disconnect()
}
```

## Events

```javascript
import Node from '@inshel/node'

const myFn = async (node, keyId) => {
  const handler = (eventType, event) => console.log(`${eventType}:${JSON.stringify(event)}`)

  node.on('connect', handler)
  node.on('disconnect', handler)
  node.on('error', handler)

  // Do something

  node.unsubscribe('connect', handler)
  node.unsubscribe('disconnect', handler)
  node.unsubscribe('error', handler)
}
```

Supported events:
- connect
- disconnect
- error