import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatGridListModule, MatTooltipModule, MatIconModule, MatMenuModule } from '@angular/material';

import { ThemePickerComponent } from './theme-picker/theme-picker.component';

@NgModule({
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule, MatGridListModule, MatTooltipModule],
  declarations: [ThemePickerComponent],
  exports: [ThemePickerComponent]
})
export class ThemePickerModule {}
