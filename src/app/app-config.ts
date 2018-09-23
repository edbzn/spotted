import { AppConfiguration } from './app-config.model';

export const appConfiguration: AppConfiguration = {
  httpDebounceTime: 400,
  defaultPhotoUrl: 'https://api.adorable.io/avatars/210/abott@adorable.png',
  defaultLang: 'fr',
  routerTransitionTiming: 0.3, // 300ms,
  notFoundImage: 'assets/images/glitch.webp',
  forms: {
    passwordMinLength: 3,
    nameMinLength: 3,
  },
  map: {
    spotIconUrl: 'assets/images/spot-marker.png',
    helpMarker: 'assets/images/help-marker.png',
    latitude: 46.879966,
    longitude: -121.726909,
    zoom: 15,
    maxZoom: 17,
    minZoom: 14,
    totalMapHeight: 100, // in %
    mobileExpandedMapHeight: 85, // in %
  },
  entities: {
    spot: {
      difficulties: ['pro', 'mid', 'easy', 'all'],
      types: ['curb', 'rail', 'ramp', 'street-plaza', 'park', 'bowl', 'dirt'],
      disciplines: ['BMX', 'roller', 'skate'],
    },
  },
};
