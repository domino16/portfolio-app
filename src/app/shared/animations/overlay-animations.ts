import {
  animate,
  group,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const overlayAnimationTrigger = [
  trigger('slideFirstDiv', [
    transition('* => *', [
      style({
        position: 'fixed',
        top: '100%',
        width: '100vw',
        height: '500px',
        backgroundColor: '#121315',
      }),
      group([
        animate(
          '2s cubic-bezier(.6, 0, .1, 1)',
          style({
            top: 0,
          })
        ),
        animate(
          '1s 1.2s cubic-bezier(.6, 0, .1, 1)',
          style({
            height: 0,
          })
        ),
      ]),
    ]),
  ]),
  trigger('slideSecondDiv', [
    transition('* <=> *', [
      style({
        position: 'fixed',
        top: '100%',
        width: '100vw',
        height: '500px',
        backgroundColor: '#1a2023',
      }),
      group([
        animate(
          '1.4s .6s cubic-bezier(.6, 0, .1, 1)',
          style({
            top: '0',
          })
        ),
        animate(
          '2s 1s cubic-bezier(.6, 0, .1, 1)',
          style({
            height: 0,
          })
        ),
      ]),
    ]),
  ]),
  trigger('openDelay', [
    transition(':enter', [
      style({
        inset: '100%',
      }),
      animate(
        '1s .5s cubic-bezier(.6, 0, .1, 1)',
        style({
          inset: 0,
        })
      ),
    ]),
    transition(':leave', [
      style({
        inset: '0',
      }),
      animate(
        '1s 1s cubic-bezier(.6, 0, .1, 1)',
        style({
          inset: '100%',
        })
      ),
    ]),
  ]),
];
