import { InjectionToken } from '@angular/core';

import { SpecialKey } from './special-key';

export interface IKeyboardIcons {
  [key: string]: string;
}

export const MAT_KEYBOARD_ICONS = new InjectionToken<IKeyboardIcons>('MAT_KEYBOARD_ICONS');
export const keyboardIcons: IKeyboardIcons = {
  [SpecialKey.Bksp]: 'keyboard_backspace',
  [SpecialKey.Caps]: 'keyboard_capslock',
  [SpecialKey.Enter]: 'keyboard_return',
  [SpecialKey.Shift]: 'keyboard_arrow_up',
  [SpecialKey.Space]: ' ',
  [SpecialKey.Tab]: 'keyboard_tab'
};
