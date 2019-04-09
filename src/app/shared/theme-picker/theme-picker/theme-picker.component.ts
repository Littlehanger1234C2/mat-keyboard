import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  EventEmitter,
  Output,
  TrackByFunction
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
export class ThemePickerComponent {
  currentTheme: SiteTheme;

  @Input()
  themes: SiteTheme[] = [];

  @Output()
  readonly themeChanged = new EventEmitter<SiteTheme>();

  constructor(private styleManager: StyleManager) {}

  trackTheme: TrackByFunction<SiteTheme> = (_index, theme) => theme.name;

  installTheme(themeName: string): void {
    // TODO refactor to map search
    const nextTheme = this.themes.find(theme => theme.name === themeName);

    if (!nextTheme) {
      return;
    }

    this.currentTheme = nextTheme;
    this._handleThemeChange(nextTheme);
  }

  generateThemeGradient({ primary, accent }: SiteTheme): string {
    return `linear-gradient(-45deg, ${accent}, ${accent} 50%, ${primary} 50%)`;
  }

  private _handleThemeChange(next: SiteTheme): void {
    if (next.isDefault) {
      this.styleManager.removeStyle('theme');
    } else {
      this.styleManager.setStyle('theme', next.href);
    }
    this.themeChanged.emit(next);
  }
}
