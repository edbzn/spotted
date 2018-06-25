import { SpotModule } from './spot.module';

describe('SpotModule', () => {
  let spotModule: SpotModule;

  beforeEach(() => {
    spotModule = new SpotModule();
  });

  it('should create an instance', () => {
    expect(spotModule).toBeTruthy();
  });
});
