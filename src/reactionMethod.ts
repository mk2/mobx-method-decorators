import assert from 'assert';

import { kReactableMethodNames, kShouldDispose } from '@/helpers/mobx/ReactableMixin';
import { IReactionDisposer, IReactionPublic, reaction } from 'mobx';

const kDisposer = Symbol('Disposer');

type DisposerOwner = {
  [kDisposer]: IReactionDisposer | undefined;
};

export default function reactionMethod<T>(expression: (r: IReactionPublic) => T): MethodDecorator {
  return (target: any, methodName, descriptor: TypedPropertyDescriptor<any>) => {
    assert(target != null, 'target is null or undefined');
    assert(target[kReactableMethodNames], 'target does not have kReactableMethodNames symbol');
    if (!target[kReactableMethodNames]) target[kReactableMethodNames] = [];
    target[kReactableMethodNames].push(methodName);

    const effectFn = descriptor.value as Function;
    return {
      configurable: true,
      get() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this as DisposerOwner;
        const disposer = self[kDisposer];
        return ((...args: any[]) => {
          if (args[0] === kShouldDispose) {
            disposer?.();
            self[kDisposer] = undefined;
            return;
          }

          if (disposer) {
            // 既にreactionの登録が終わっていた場合は、普通のメソッド呼び出しなので、オリジナルのメソッドを呼び出す
            effectFn.apply(self, args);
          } else {
            self[kDisposer] = reaction(expression, v => {
              effectFn.apply(self, [v]);
            });
          }
        }) as any;
      },
    };
  };
}
