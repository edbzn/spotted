import { Api } from '../types/api';
import { AppConfiguration } from './app-config.model';

export const appConfiguration: AppConfiguration = {
  httpDebounceTime: 400,
  map: {
    latitude: 46.879966,
    longitude: -121.726909,
    zoom: 15,
    maxZoom: 20,
  },
  entities: {
    spot: {
      difficulties: ['hammer', 'hard', 'pro', 'mid', 'low', 'mixed'],
      types: ['park', 'street-park', 'street', 'bowl', 'dirt'],
      disciplines: ['BMX', 'roller', 'skate'],
    },
  },
};
