# mobx-method-decorators

- Assist `reaction(...)` calling with class-oriented way.

## How to use?

### isntall

```sh
yarn add mobx-method-decorators
```

### write code

```ts
import mobx from 'mobx';
import { ReactableMixin, reactionMethod } from 'mobx-method-decorators';

const store = mobx.observable({
  message: 'Hello world.',
});

class Sample extends ReactableMixin {
  constructor() {
    this.makeReactable();
  }

  @reactionMethod(() => store.message)
  method() {
    // Execute whenever store.message changed.
  }

  detach() {
    // Dispose any reactions, call `unmakeReactable`
    this.unmakeReactable();
  }
}
```

## Copyright

MIT
