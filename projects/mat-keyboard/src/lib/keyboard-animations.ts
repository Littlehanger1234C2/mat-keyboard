import { animate, state, style, transition, trigger, AnimationTriggerMetadata } from '@angular/animations';
import { AnimationCurves, AnimationDurations } from '@angular/material';

export enum KeyboardAnimationState {
  Void = 'void',
  Visible = 'visible',
  Hidden = 'hidden'
}

export enum KeyboardAnimationTransition {
  Hide = 'visible => hidden',
  Show = 'void => visible'
}

// We can't use constants from animation.ts here because you can't use
// a text interpolation in anything that is analyzed statically with ngc (for AoT compile).
const SHOW_ANIMATION = `${AnimationDurations.ENTERING} ${AnimationCurves.DECELERATION_CURVE}`;
const HIDE_ANIMATION = `${AnimationDurations.EXITING} ${AnimationCurves.ACCELERATION_CURVE}`;

const animationBody = [
  state(`${KeyboardAnimationState.Void}, ${KeyboardAnimationState.Hidden}`, style({ transform: 'translateY(100%)' })),
  state(`${KeyboardAnimationState.Visible}`, style({ transform: 'translateY(0%)' })),
  transition(`${KeyboardAnimationTransition.Hide}`, animate(HIDE_ANIMATION)),
  transition(`${KeyboardAnimationTransition.Show}`, animate(SHOW_ANIMATION))
];

export const matKeyboardAnimations: {
  readonly keyboardContainer: AnimationTriggerMetadata;
} = {
  keyboardContainer: trigger('keyboardContainer', animationBody)
};
