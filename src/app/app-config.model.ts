import { Language } from './../types/global.d';
import { Api } from '../types/api';

export interface AppConfiguration {
  httpDebounceTime: number;
  defaultPhotoUrl: string;
  defaultLang: Language;
  routerTransitionTiming: number;
  notFoundImage: string;
  forms: {
    passwordMinLength: number;
    nameMinLength: number;
  };
  map: {
    helpMarker: string;
    spotIconUrl: string;
    latitude: number;
    longitude: number;
    zoom: number;
    maxZoom: number;
    minZoom: number;
    totalMapHeight: number;
    mobileExpandedMapHeight: number;
  };
  entities: {
    spot: {
      difficulties: Array<Api.Difficulty>;
      types: Array<Api.Type>;
      disciplines: Array<Api.Disciplines>;
    };
  };
}
