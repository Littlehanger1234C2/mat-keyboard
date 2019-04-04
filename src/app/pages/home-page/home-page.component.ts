import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  ElementRef,
  Inject,
  LOCALE_ID,
  ViewEncapsulation
} from '@angular/core';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { MatKeyboardRef, IKeyboardLayout, MatKeyboard, MAT_KEYBOARD_LAYOUTS } from '@ngx-extensions/mat-keyboard';
import { NgModel, NgControl, FormControl, NgForm } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'demo-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit, OnDestroy {
  private _enterSubscription = Subscription.EMPTY;

  private _keyboardRef: MatKeyboardRef;

  private _submittedForms = new BehaviorSubject<{ control: string; value: string }[][]>([]);

  @ViewChild('attachTo', { read: ElementRef })
  private _attachToElement: ElementRef;

  @ViewChild('attachTo', { read: NgModel })
  private _attachToControl: NgControl;

  get submittedForms(): Observable<{ control: string; value: string }[][]> {
    return this._submittedForms.asObservable();
  }

  duration: number;

  isDebug: boolean;

  defaultLocale: string;

  layout: string;

  layouts: {
    name: string;
    layout: IKeyboardLayout;
  }[];

  testModelValue = 'Sushi';

  attachModelValue = '';

  testControlValue = new FormControl({ value: 'Emmentaler', disabled: false });

  get keyboardVisible(): boolean {
    return this._keyboardService.isOpened;
  }

  constructor(
    private _keyboardService: MatKeyboard,
    @Inject(LOCALE_ID) public locale,
    @Inject(MAT_KEYBOARD_LAYOUTS) private _layouts
  ) {}

  ngOnInit() {
    this.defaultLocale = ` ${this.locale}`.slice(1);
    this.layouts = Object.keys(this._layouts)
      .map((name: string) => ({
        name,
        layout: this._layouts[name]
      }))
      .sort((a, b) => a.layout.name.localeCompare(b.layout.name));
  }

  ngOnDestroy() {
    this.closeCurrentKeyboard();
  }

  submitForm(form?: NgForm) {
    const submittedForms = this._submittedForms.getValue();
    const submittedForm = Object.keys(form.controls).map((control: string) => ({
      control,
      value: form.controls[control].value
    }));
    submittedForms.push(submittedForm);
    this._submittedForms.next(submittedForms);
  }

  openKeyboard(locale = this.defaultLocale) {
    this._keyboardRef = this._keyboardService.open(locale, {
      duration: this.duration,
      isDebug: this.isDebug
    });
    if (this._enterSubscription) {
      this._enterSubscription.unsubscribe();
    }
    this._enterSubscription = this._keyboardRef.instance.enterClick.subscribe(() => {
      this.submitForm();
    });
  }

  closeCurrentKeyboard() {
    if (this._keyboardRef) {
      this._keyboardRef.dismiss();
    }

    if (this._enterSubscription) {
      this._enterSubscription.unsubscribe();
    }
  }

  openAttachedKeyboard(locale = this.defaultLocale) {
    this._keyboardRef = this._keyboardService.open(locale, {
      duration: this.duration,
      isDebug: this.isDebug
    });

    // reference the input element
    this._keyboardRef.instance.setInputInstance(this._attachToElement);

    // set control
    this._keyboardRef.instance.attachControl(this._attachToControl.control);
  }

  toggleDebug(toggle: MatSlideToggleChange) {
    this.isDebug = toggle.checked;
    this._keyboardRef.instance.isDebug = this.isDebug;
  }
}
