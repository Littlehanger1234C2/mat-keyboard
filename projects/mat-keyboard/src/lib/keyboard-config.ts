import { ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { AriaLivePoliteness } from '@angular/cdk/a11y';

const configDefaults: MatKeyboardConfig = {
  politeness: 'assertive',
  announcementMessage: '',
  duration: 0
};

export interface MatKeyboardConfig {
  /** The politeness level for the MatAriaLiveAnnouncer announcement. */
  politeness: AriaLivePoliteness;

  /** Message to be announced by the MatAriaLiveAnnouncer */
  announcementMessage: string;

  /** The view container to place the overlay for the keyboard into. */
  viewContainerRef?: ViewContainerRef;

  /** The length of time in milliseconds to wait before automatically dismissing the keyboard after blur. */
  duration: number;

  /** Enable the debug view **/
  ngControl?: NgControl;
}

/**
 * Applies default options to the keyboard configs.
 * @param config The configuration to which the defaults will be applied.
 * @returns The new configuration object with defaults applied.
 */
export function _applyConfigDefaults(config: Partial<MatKeyboardConfig>): MatKeyboardConfig {
  return { ...configDefaults, ...config };
}
