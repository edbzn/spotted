import { appConfiguration } from '../app-config';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';

export const fade = trigger('fade', [
  transition(
    '* => *',
    useAnimation(fadeIn, {
      params: {
        timing: appConfiguration.routerTransitionTiming,
      },
    })
  ),
]);
