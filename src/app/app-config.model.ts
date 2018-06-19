import { Language } from './../types/global.d';
import { Api } from '../types/api';

export interface AppConfiguration {
  httpDebounceTime: number;
  defaultLang: Language;
  map: {
    spotIconUrl: string;
    helpMarker: string;
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
