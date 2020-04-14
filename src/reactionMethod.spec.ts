import * as mobx from 'mobx';

import ReactableMixin from './ReactableMixin';
import reactionMethod from './reactionMethod';

describe('reactionMethod', () => {
  const effectFnBodyMock = jest.fn();
  const disposerMock = jest.fn();
  const reactionMock = jest.spyOn(mobx, 'reaction');

  let effectMock: Function | undefined;

  class TargetClass extends ReactableMixin {
    @reactionMethod(() => ({}))
    effectFn(...args: unknown[]) {
      effectFnBodyMock(args);
    }
  }

  beforeEach(() => {
    effectFnBodyMock.mockClear();
    disposerMock.mockClear();
    reactionMock.mockClear();
    reactionMock.mockImplementation((_expression: unknown, effect: any) => {
      effectMock = effect;
      return disposerMock as any;
    });
  });

  it('必要なメソッドがミックスインされていること', () => {
    const target = new TargetClass();
    expect(target.makeReactable).toEqual(expect.any(Function));
    expect(target.unmakeReactable).toEqual(expect.any(Function));
  });

  it('makeReactableが呼ばれたら、reactionMockが一度呼ばれること', () => {
    const target = new TargetClass();
    target.makeReactable();
    expect(reactionMock).toHaveBeenCalledTimes(1);
  });

  it('reactionのeffectが実行されると、クラスのeffect関数が実行されること', () => {
    const target = new TargetClass();
    target.makeReactable();
    effectMock?.();
    expect(effectFnBodyMock).toHaveBeenCalledTimes(1);
  });

  it('reactionのeffectが実行されると、クラスのeffect関数が実行されること', () => {
    const target = new TargetClass();
    target.makeReactable();
    target.effectFn();
    expect(effectFnBodyMock).toHaveBeenCalledTimes(1);
  });
});
