import { Api } from '../types/api';

export interface AppConfiguration {
  httpDebounceTime: number;
  map: {
    latitude: number;
    longitude: number;
    zoom: number;
    maxZoom: number;
  };
  entities: {
    spot: {
      difficulties: Array<Api.Difficulty>;
      types: Array<Api.Type>;
      disciplines: Array<Api.Disciplines>;
    };
  };
}
