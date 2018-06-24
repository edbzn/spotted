import { appConfiguration } from './../app-config';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';

export const fadeAnimation = trigger('fadeAnimation', [
  transition(
    '* => *',
    useAnimation(fadeIn, {
      params: {
        timing: appConfiguration.routerTransitionTiming,
      },
    })
  ),
]);
