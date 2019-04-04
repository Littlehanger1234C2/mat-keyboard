import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatTabsModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatToolbarModule,
  MatTooltipModule,
  MatIconRegistry
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import {
  IKeyboardLayouts,
  keyboardLayouts,
  MAT_KEYBOARD_LAYOUTS,
  MatKeyboardModule
} from '@ngx-extensions/mat-keyboard';

import { AppComponent } from './app.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ThemePickerModule } from './shared';
import { AppRoutingModule, ROUTED_COMPONENTS } from './app-routing.module';

const customLyouts: IKeyboardLayouts = {
  ...keyboardLayouts,
  'Tolles Layout': {
    name: 'Awesome layout',
    keys: [[['1', '!'], ['2', '@'], ['3', '#']]],
    lang: ['de-CH']
  }
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ThemePickerModule,
    AppRoutingModule,
    // Material
    MatTooltipModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatKeyboardModule
  ],
  declarations: [AppComponent, MainLayoutComponent, ROUTED_COMPONENTS],
  providers: [{ provide: MAT_KEYBOARD_LAYOUTS, useValue: customLyouts }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _iconRegistry: MatIconRegistry, private _domSanitizer: DomSanitizer) {
    this._iconRegistry
      .addSvgIconInNamespace(
        'assets',
        'github',
        this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg')
      )
      .addSvgIconInNamespace(
        'assets',
        'theme_light_dark',
        this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/theme_light_dark.svg')
      );
  }
}
