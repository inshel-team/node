# Rays

Ray is basically contracts event bus.

# Subscribe

```javascript
const raysSubscribe = (key, contract, ray) => {
  await node.rays.subscribe(key, { contract, ray }, (contract, ray, message) => {

  })
}
```

# Unsubscribe

```javascript
const raysSubscribe = (key, contract, ray, handler) => {
  await node.rays.subscribe(key, { contract, ray }, handler)
}
```