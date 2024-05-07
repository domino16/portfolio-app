import {
  animate,
  group,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const overlayAnimationTrigger = [
  trigger('slideFirstDiv', [
    transition('* => *', [
      style({
        position: 'fixed',
        top: '-10%',
        width: '100vw',
        height: '100vh',
        transform: 'translateY(110%)',
        backgroundColor: '#00dede',
        borderRadius: '80% 80% 0 0 / 40% 40% 0 0',
      }),
      group([
        animate(
          '1.5s cubic-bezier(.6, 0, .1, 1)',
          
          style({
            transform: 'translateY(0)',
            
            borderRadius: '0',
          })
        ),
        animate(
          '.75s .75s cubic-bezier(.6, 0, .1, 1)',
          style({
            height: '10vh',
          })
        ),
      ]),
    ]),
  ]),
  trigger('slideSecondDiv', [
    transition('* => *', [
      style({
        position: 'fixed',
        top: '-10%',
        width: '100vw',
        height: '100vh',
        transform: 'translateY(110%)',
        backgroundColor: '#121315',
        borderRadius: '80% / 40%',
      }),
      group([
        animate(
          '1.5s .3s cubic-bezier(.6, 0, .1, 1)',
          style({
            transform: 'translateY(0)',
            borderRadius: '0 0 10% 10%',
          })
        ),
        animate(
          '1.2s .75s cubic-bezier(.6, 0, .1, 1)',
          style({
            height: '10vh',
          })
        ),
      ]),
    ]),
  ]),
  trigger('openDelay', [
    transition(':enter', [
      style({
        bottom: '100%',
      }),
      animate(
        '0.01s .94s cubic-bezier(.6, 0, .1, 1)',
        style({
          bottom: 0,
        })
      ),
    ]),
    transition(':leave', [
      style({
        bottom: '0',
      }),
      animate(
        '0.01s 1.01s cubic-bezier(.6, 0, .1, 1)',
        style({
          bottom: '100%',
        })
      ),
    ]),
  ]),
];
