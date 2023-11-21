import { libsSharedServices } from './libs/shared-services';

describe('libsSharedServices', () => {
  it('should work', () => {
    expect(libsSharedServices()).toEqual('libs/shared-services');
  });
});
