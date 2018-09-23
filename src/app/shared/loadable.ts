/**
 * Distinct first initialization request than update
 */
export const enum InitializationState {
  initialize,
  initialized,
}

export const enum LoadingState {
  none,
  loading,
}

/**
 * When a component need to fetch some data remotely
 * we should extend this to homogenize component's Api
 */
export abstract class Loadable {
  public loadingState: LoadingState = LoadingState.none;
  public initializationState: InitializationState =
    InitializationState.initialize;

  get initialized(): boolean {
    return this.initializationState === InitializationState.initialized;
  }

  get loading(): boolean {
    return this.loadingState === LoadingState.loading;
  }

  protected setInitializationState(state: InitializationState): void {
    this.initializationState = state;
  }

  protected setLoadingState(state: LoadingState): void {
    this.loadingState = state;
  }
}
