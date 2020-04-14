import { IReactionDisposer } from 'mobx';

export const kReactableMethodNames = Symbol('ReactableMethodNames');
export const kShouldDispose = Symbol('ShouldDispose');
export const kDisposers = Symbol('Disposers');

interface ReactableMixin {
  [methodName: string]: Function;
  [kReactableMethodNames]: string[];
  [kDisposers]: Record<string, IReactionDisposer | undefined>;
  makeReactable(): void;
  unmakeReactable(): void;
}

class ReactableMixin {
  makeReactable() {
    const reactableMethodNames = this[kReactableMethodNames];
    for (const methodName of reactableMethodNames) {
      this[methodName]();
    }
  }

  unmakeReactable() {
    const reactableMethodNames = this[kReactableMethodNames];
    for (const methodName of reactableMethodNames) {
      this[methodName](kShouldDispose);
    }
  }
}

export default ReactableMixin;
