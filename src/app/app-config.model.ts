import { Api } from '../types/api';

export interface AppConfiguration {
  httpDebounceTime: number;
  entities: {
    spot: {
      difficulties: Array<Api.Difficulty>;
      types: Array<Api.Type>;
      disciplines: Array<Api.Disciplines>;
    };
  };
}
