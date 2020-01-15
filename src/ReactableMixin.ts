export const kReactableMethodNames = Symbol('ReactableMethodNames');
export const kShouldDispose = Symbol('ShouldDispose');

export type ReactableMethodNamesOwner = {
  [kReactableMethodNames]: string[];
};

export default class ReactableMixin implements ReactableMethodNamesOwner {
  [kReactableMethodNames] = [];

  makeReactable() {
    const reactableMethodNames = this[kReactableMethodNames];
    for (const methodName of reactableMethodNames) {
      (this as any)[methodName]();
    }
  }

  unmakeReactable() {
    const reactableMethodNames = this[kReactableMethodNames];
    for (const methodName of reactableMethodNames) {
      (this as any)[methodName](kShouldDispose);
    }
  }
}
