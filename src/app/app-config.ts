import { Api } from '../types/api';
import { AppConfiguration } from './app-config.model';

export const appConfiguration: AppConfiguration = {
  httpDebounceTime: 400,
  entities: {
    spot: {
      difficulties: ['hammer', 'hard', 'pro', 'mid', 'low', 'mixed'],
      types: ['park', 'street-park', 'street', 'bowl', 'dirt'],
      disciplines: ['BMX', 'roller', 'skate'],
    },
  },
};
