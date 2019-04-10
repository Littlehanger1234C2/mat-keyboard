import { Injectable, Inject } from '@angular/core';

import { MAT_KEYBOARD_LAYOUTS, IKeyboardLayouts, IKeyboardLayout } from './keyboard-layouts-config';
import { ILocaleMap } from './locale-map';

/**
 * Applies available layouts.
 * @param layouts
 */
function _applyAvailableLayouts(layouts: IKeyboardLayouts): ILocaleMap {
  const _availableLocales: ILocaleMap = {};

  Object.entries(layouts)
    .filter(([, layout]) => 'lang' in layout)
    .forEach(([name, layout]) => {
      layout.lang.forEach(lang => {
        _availableLocales[lang] = name;
      });
    });

  return _availableLocales;
}

@Injectable()
export class MatKeyboardLayout {
  private _availableLocales: ILocaleMap = {};
  get availableLocales(): ILocaleMap {
    return this._availableLocales;
  }

  constructor(@Inject(MAT_KEYBOARD_LAYOUTS) private readonly _layouts: IKeyboardLayouts) {
    this._availableLocales = _applyAvailableLayouts(_layouts);
  }

  isLocaleAvailable(locale: string): boolean {
    return locale in this.availableLocales;
  }

  isLayoutAvailable(layout: string): boolean {
    return layout in this._layouts;
  }

  /**
   * Map a given locale to a layout name.
   * @param locale The layout name
   */
  mapLocale(locale: string): string {
    let layout: string;
    const country = locale.split('-').shift();

    // search for layout matching the
    // first part, the country code
    if (this.availableLocales[country]) {
      layout = this.availableLocales[locale];
    }

    // look if the detailed locale matches any layout
    if (this.availableLocales[locale]) {
      layout = this.availableLocales[locale];
    }

    if (!layout) {
      throw Error(`No layout found for locale ${locale}`);
    }

    return layout;
  }

  getLayout(layout: string): IKeyboardLayout | null {
    return this._layouts[layout];
  }

  getLocaleLayout(locale: string): IKeyboardLayout {
    return this._layouts[this.mapLocale(locale)];
  }
}
