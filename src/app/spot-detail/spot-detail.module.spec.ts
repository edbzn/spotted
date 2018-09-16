import { SpotModule } from './spot-detail.module';

describe('SpotModule', () => {
  let spotModule: SpotModule;

  beforeEach(() => {
    spotModule = new SpotModule();
  });

  it('should create an instance', () => {
    expect(spotModule).toBeTruthy();
  });
});
