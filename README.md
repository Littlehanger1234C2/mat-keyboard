# @ngx-extensions/mat-keyboard

<p align="center">
  <br/>
  Onscreen virtual keyboard for Angular using Angular Material.
  <br/><br/>  
  <a href="https://www.npmjs.com/package/@ngx-extensions/mat-keyboard">
    <img src="https://img.shields.io/npm/v/%40ngx-extensions/mat-keyboard.svg" alt="npm version"/>
  </a>
  <a href="https://circleci.com/gh/ngx-extensions/mat-keyboard">
    <img src="https://circleci.com/gh/ngx-extensions/mat-keyboard/tree/develop.svg?style=shield" alt="CircleCI status"/>
  </a>
  <a href='https://coveralls.io/github/ngx-extensions/mat-keyboard?branch=develop'>
    <img src='https://coveralls.io/repos/github/ngx-extensions/mat-keyboard/badge.svg?branch=develop' alt='Coverage status' />
  </a>
  <br/>
  <a href="https://david-dm.org/ngx-extensions/mat-keyboard">
    <img src="https://david-dm.org/ngx-extensions/mat-keyboard.svg"/>
  </a>
  <a href="https://david-dm.org/ngx-extensions/mat-keyboard?type=dev">
    <img src="https://david-dm.org/ngx-extensions/mat-keyboard/dev-status.svg"/>
  </a>
  <a href="https://commitizen.github.io/cz-cli">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg"/>
  </a>
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=shield"/>
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/npm/l/@ngx-extensions/mat-keyboard.svg"/>
  </a>
</p>

---

## Demo

A demo can be found [here][demo].

## Docs

Generated documentation can be found [here][docs].

## Installation

```bash
npm install @ngx-extensions/mat-keyboard
```

## Setup

Import `MatKeyboardModule` into a module, eg. `AppModule`:

```typescript
import { MatKeyboardModule } from '@ngx-extensions/mat-keyboard';

@NgModule({
  imports: [
    ...
    MatKeyboardModule,
    ...
  ],
  ...
})
export class AppModule {}
```

## Usage

Use the `MatKeyboardInput` directive on your input elements or textareas and set the name or locale of the layout.

> If not provided the locale will be derieved from the `LOCALE_ID` or the browser.

```html
<input [matKeyboard]="'Azərbaycanca'" />
```

Use the `MatKeyboard` service in order to manually open a virtual keyboard and handle it through a reference.

```typescript
import { MatKeyboard, MatKeyboardRef } from '@ngx-extensions/mat-keyboard';

export class DemoComponent {
 private keyboardRef: MatKeyboardRef;
 constructor(private readonly keyboard: MatKeyboard) {}

 openKeyboard() {
  this.keyboardRef = this.keyboard.open();
  keyboardRef.afterDismissed().subscribe(() => console.log('Keyboard closed'));
 }

 closeKeyboard() {
  if (!!this.keyboardRef) {
   this.keyboardRef.dismiss();
  }
 }
}
```

## Providing custom layouts

Most of the base configurations are provided as [injection tokens][injectiontoken]. Please read [the documentation][injectiontoken] to
understand how to handle it.

All layouts are based on (or directly inherited from) the [angular-virtual-keyboard][the-darc/angular-virtual-keyboard] which is based on
[GreyWyvern VKI]. For details on how to structure a layout see the [comment derived from the original source code][vki readme].

> Note that this will most likely be changed in the near future. But for now a huge range of layouts is already usable because of the
> [great contribution][vki credits] back then.

But basicly you just provide the configuration of your new layout in your `AppModule`:

```typescript
import {
  IKeyboardLayouts,
  keyboardLayouts,
  MAT_KEYBOARD_LAYOUTS,
  MatKeyboardModule
} from '@ngx-extensions/mat-keyboard';

const customLayouts: IKeyboardLayouts = {
  ...keyboardLayouts,
  'Tölles Läyout': {
    'name': 'Awesome layout',
    'keys': [
      [
        ['1', '!'],
        ['2', '@'],
        ['3', '#']
      ]
    ],
    'lang': ['de-CH']
  }
};

@NgModule({
  ...
  providers: [
    { provide: MAT_KEYBOARD_LAYOUTS, useValue: customLayouts }
  ],
  ...
})
export class AppModule {}
```

[the-darc/angular-virtual-keyboard]: https://github.com/the-darc/angular-virtual-keyboard
[greywyvern vki]: http://www.greywyvern.com/code/javascript/keyboard
[demo]: https://ngx-extensions.github.io/mat-keyboard
[docs]: https://ngx-material-keyboard.github.io/core/
[injectiontoken]: https://angular.io/guide/dependency-injection-in-action#injectiontoken
[vki readme]: https://goo.gl/fCDExr
[vki credits]: https://goo.gl/NYqTwc
