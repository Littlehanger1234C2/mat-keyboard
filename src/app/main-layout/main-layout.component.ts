import { Component, ChangeDetectionStrategy } from '@angular/core';

import { SiteTheme } from '../shared';

@Component({
  selector: 'demo-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  readonly themes: ReadonlyArray<SiteTheme>;

  constructor() {
    this.themes = [
      {
        primary: '#673AB7',
        accent: '#FFC107',
        name: 'deeppurple-amber',
        isDark: false,
        href: 'deeppurple-amber.css'
      },
      {
        primary: '#3F51B5',
        accent: '#E91E63',
        name: 'indigo-pink',
        isDark: false,
        isDefault: true,
        href: 'indigo-pink.css'
      },
      {
        primary: '#E91E63',
        accent: '#607D8B',
        name: 'pink-bluegrey',
        isDark: true,
        href: 'pink-bluegrey.css'
      },
      {
        primary: '#9C27B0',
        accent: '#4CAF50',
        name: 'purple-green',
        isDark: true,
        href: 'purple-green.css'
      },
      {
        primary: '#ff3d00',
        accent: '#546e7a',
        href: 'deeporange-bluegrey.css',
        name: 'deeporange-bluegrey',
        isDark: true
      }
    ];
  }
}
