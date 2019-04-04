import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  EventEmitter,
  Output
} from '@angular/core';

import { SiteTheme } from '../site-theme';
import { StyleManager } from '../style-manager.service';

@Component({
  selector: 'demo-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'theme-picker', 'aria-hidden': 'true' }
})
export class ThemePickerComponent implements OnInit {
  currentTheme: SiteTheme;

  @Input()
  themes: SiteTheme[] = [];

  @Output()
  readonly themeChanged = new EventEmitter<SiteTheme>();

  constructor(private styleManager: StyleManager) {}

  ngOnInit() {}

  trackTheme(_index: number, theme: SiteTheme) {
    return theme.name;
  }

  installTheme(themeName: string) {
    // TODO refactor to map search
    const nextTheme = this.themes.find(theme => theme.name === themeName);

    if (!nextTheme) {
      return;
    }

    this.currentTheme = nextTheme;
    this._handleThemeChange(nextTheme);
  }

  private _handleThemeChange(next: SiteTheme) {
    if (next.isDefault) {
      this.styleManager.removeStyle('theme');
    } else {
      this.styleManager.setStyle('theme', next.href);
    }
    this.themeChanged.emit(next);
  }
}
