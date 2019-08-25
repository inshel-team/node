# Redirect

*IS Network support only one redirect in lambda call*

**Actors**
- Client node - Alice
- Original contract node - Bob
- Contract node - Charlie
- InShel Network - IS Network

**Scenario**
1. Alice call Charlie to execute lambda "secondary"
2. Charlie return IS Network redirect this lambda call to original contract
3. IS Network call Bob to execute lambda and returns as result Alice

## Redirect lambda

```javascript
import Redirect from '@inshel/node/lib/redirect'

const executeLambda = async (lambdaType, params, key) => {
  switch (lambdaType) {
    case 'secondary':
      return new Redirect({
        contract: originalContract,
        lambda: 'lambda',
        params: { ...params, newParams: true }
      })

    ...
  }
}
```
