import * as mobx from 'mobx';

import ReactableMixin from './ReactableMixin';
import reactionMethod from './reactionMethod';

describe('reactionMethod', () => {
  let effectFnBodyMock = jest.fn();
  let disposerMock = jest.fn();
  let effectMock: Function | undefined;
  let reactionMock = jest.spyOn(mobx, 'reaction');

  class TargetClass extends ReactableMixin {
    @reactionMethod(() => ({}))
    effectFn(...args: any[]) {
      effectFnBodyMock(args);
    }
  }

  beforeEach(() => {
    effectFnBodyMock = jest.fn();
    disposerMock = jest.fn();
    reactionMock = jest.spyOn(mobx, 'reaction').mockImplementation((_expression: unknown, effect: any) => {
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
