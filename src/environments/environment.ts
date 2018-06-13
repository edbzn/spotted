import { enableDebugTools } from '@angular/platform-browser';
import { ApplicationRef, NgModuleRef } from '@angular/core';
import { Environment } from './model';

export const environment: Environment = {
  production: false,
  showDevModule: true,
  /**
   * Angular debug tools in the dev console
   * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
   * @param modRef
   * @return {any}
   */ decorateModuleRef(modRef: NgModuleRef<any>): any {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    const _ng = (<any>window).ng;
    enableDebugTools(cmpRef);
    (<any>window).ng.probe = _ng.probe;
    (<any>window).ng.coreTokens = _ng.coreTokens;
    return modRef;
  },
  ENV_PROVIDERS: [],
  firebase: {
    apiKey: 'AIzaSyBuBD4A_IkayjEIqwjUO_6ewKC38eKAX4k',
    authDomain: 'spotted-1528021262358.firebaseapp.com',
    databaseURL: 'https://spotted-1528021262358.firebaseio.com',
    projectId: 'spotted-1528021262358',
    storageBucket: 'spotted-1528021262358.appspot.com',
    messagingSenderId: '530601209274',
  },
};
