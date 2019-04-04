import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCommonModule, MatButtonModule, MatIconModule, MatInputModule } from '@angular/material';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import { MatKeyboardInput } from './keyboard-input.directive';
import { MatKeyboardComponent } from './keyboard/keyboard.component';
import { MatKeyboardKeyComponent } from './keyboard-key/keyboard-key.component';
import { MatKeyboardContainerComponent } from './keyboard-container/keyboard-container.component';
import { MatKeyboard } from './keyboard.service';
import { MatKeyboardLayout } from './keyboard-layout.service';
import { MAT_KEYBOARD_DEADKEYS, keyboardDeadkeys } from './keyboard-deadkey-config';
import { MAT_KEYBOARD_ICONS, keyboardIcons } from './keyboard-icons-config';
import { MAT_KEYBOARD_LAYOUTS, keyboardLayouts } from './keyboard-layouts-config';

@NgModule({
  imports: [
    CommonModule,
    MatCommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    A11yModule,
    OverlayModule,
    PortalModule
  ],
  declarations: [MatKeyboardInput, MatKeyboardContainerComponent, MatKeyboardComponent, MatKeyboardKeyComponent],
  entryComponents: [MatKeyboardContainerComponent, MatKeyboardComponent, MatKeyboardKeyComponent],
  providers: [
    MatKeyboard,
    MatKeyboardLayout,
    // TODO: extract value providers
    { provide: MAT_KEYBOARD_DEADKEYS, useValue: keyboardDeadkeys },
    { provide: MAT_KEYBOARD_ICONS, useValue: keyboardIcons },
    { provide: MAT_KEYBOARD_LAYOUTS, useValue: keyboardLayouts }
  ],
  exports: [MatKeyboardInput, MatKeyboardContainerComponent, MatKeyboardComponent, MatKeyboardKeyComponent]
})
export class MatKeyboardModule {}
