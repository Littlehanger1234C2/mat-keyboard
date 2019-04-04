/*
 * Public API Surface of mat-keyboard
 */

export * from './lib/mat-keyboard.module';
export * from './lib/keyboard.service';
export * from './lib/keyboard-layout.service';
export * from './lib/keyboard-input.directive';
export * from './lib/keyboard-container/keyboard-container.component';
export * from './lib/keyboard-key/keyboard-key.component';
export * from './lib/keyboard/keyboard.component';
export { MatKeyboardConfig } from './lib/keyboard-config';
export { IKeyboardDeadkeys, MAT_KEYBOARD_DEADKEYS, keyboardDeadkeys } from './lib/keyboard-deadkey-config';
export { IKeyboardIcons, MAT_KEYBOARD_ICONS, keyboardIcons } from './lib/keyboard-icons-config';
export {
  IKeyboardLayout,
  IKeyboardLayouts,
  MAT_KEYBOARD_LAYOUTS,
  keyboardLayouts
} from './lib/keyboard-layouts-config';
export * from './lib/special-key';
export * from './lib/keyboard-modifier';
export * from './lib/keyboard-animation';
export * from './lib/keyboard-ref';
export * from './lib/locale-map';
