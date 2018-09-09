import { disableDebugTools } from '@angular/platform-browser';
import { NgModuleRef } from '@angular/core';
import { Environment } from './model';

export const environment: Environment = {
  production: true,
  hmr: false,
  showDevModule: false
  /**
   * Angular debug tools in the dev console
   * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
   * @param modRef
   * @return {any}
   */,
  decorateModuleRef(modRef: NgModuleRef<any>): any {
    disableDebugTools();
    return modRef;
  },
  ENV_PROVIDERS: [],
  ravenDNS: 'https://337b47504b844ba284e11fbb85ccf3a7@sentry.io/1234956',
  googleApiKey: 'AIzaSyAyB0VnMyWOC28h7fpLr-0pnKTvd9CiXsg',
  firebase: {
    apiKey: 'AIzaSyBuBD4A_IkayjEIqwjUO_6ewKC38eKAX4k',
    authDomain: 'spotted-1528021262358.firebaseapp.com',
    databaseURL: 'https://spotted-1528021262358.firebaseio.com',
    projectId: 'spotted-1528021262358',
    storageBucket: 'gs://spotted-1528021262358-rmuk0',
    messagingSenderId: '530601209274',
  },
  VAPID_PUBLIC_KEY:
    'BLcqVGsbH6LzE72O1YeF28qfy2w7q_3aGlha87mIkZsFHr6khJQSEJ4U_SjEFWG7XHtFOY0gg6jRM1qLMH5NgTA',
};
