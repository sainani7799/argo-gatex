import { libsSharedModels } from './libs/shared-models';

describe('libsSharedModels', () => {
  it('should work', () => {
    expect(libsSharedModels()).toEqual('libs/shared-models');
  });
});
