import { IReactionPublic, reaction } from 'mobx';

import ReactableMixin, { kDisposers, kReactableMethodNames, kShouldDispose } from './ReactableMixin';

export default function reactionMethod<T>(expression: (r: IReactionPublic) => T): MethodDecorator {
  return (target: any, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
    const methodName = propertyKey.toString();
    if (!target[kReactableMethodNames]) target[kReactableMethodNames] = [];
    if (!target[kReactableMethodNames].includes(methodName)) target[kReactableMethodNames].push(methodName);

    const effectFn = descriptor.value as Function;
    return {
      configurable: true,
      get() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this as ReactableMixin;
        if (!self[kDisposers]) self[kDisposers] = {};
        const disposer = self[kDisposers][methodName];
        return ((arg: T, r: IReactionPublic) => {
          if ((arg as any) === kShouldDispose) {
            disposer?.();
            self[kDisposers][methodName] = undefined;
            return;
          }

          if (disposer) {
            // 既にreactionの登録が終わっていた場合は、普通のメソッド呼び出しなので、オリジナルのメソッドを呼び出す
            effectFn.apply(self, [arg, r]);
          } else {
            self[kDisposers][methodName] = reaction(expression, (...args: any[]) => {
              effectFn.apply(self, args);
            });
          }
        }) as any;
      },
    };
  };
}
