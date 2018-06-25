import { AppConfiguration } from './app-config.model';

export const appConfiguration: AppConfiguration = {
  httpDebounceTime: 400,
  defaultPhotoUrl: 'https://api.adorable.io/avatars/210/abott@adorable.png',
  defaultLang: 'fr',
  routerTransitionTiming: 0.4, // 400ms,
  notFoundImage: 'assets/images/glitch.webp',
  forms: {
    passwordMinLength: 6,
    nameMinLength: 6,
  },
  map: {
    spotIconUrl: 'assets/images/spot-marker.png',
    helpMarker: 'assets/images/help-marker.png',
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
