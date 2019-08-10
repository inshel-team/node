# Invites

InShel has closed the beta.
We use invites to provide access.

## Available invites

When node approved the key, available invites return

```javascript
const approve = async (node, key) {
  const { key: keyId, invites } = await node.approve(key)
  return { keyId, invites }
}
```

## Create new invite

```javascript
const newInvite = async (node, key) {
  const { key: keyId, invites } = await node.approve(key)
  if (invites === 0) {
    throw new Error('No invites available');
  }

  const invite = await client.invites.create(key)
  return invite
}
```

## Use invite

With invite your can create a [new key](./keys.md).