import { appConfiguration } from '../app-config';
import {
  trigger,
  transition,
  useAnimation,
  stagger,
  animate,
  query,
  style,
} from '@angular/animations';
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

export const slideInOut = trigger('slideInOut', [
  transition('* => *', [
    query(':leave', [stagger(50, [animate('200ms', style({ opacity: 0 }))])], {
      optional: true,
    }),
    query(
      ':enter',
      [
        style({ opacity: 0 }),
        stagger(50, [animate('200ms', style({ opacity: 1 }))]),
      ],
      { optional: true }
    ),
  ]),
]);
