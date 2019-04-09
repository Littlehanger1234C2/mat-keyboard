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
import {
  MatKeyboardRef,
  IKeyboardLayout,
  MatKeyboard,
  MAT_KEYBOARD_LAYOUTS,
  IKeyboardLayouts
} from '@ngx-extensions/mat-keyboard';
import { NgModel, NgControl, FormControl, NgForm } from '@angular/forms';

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
    @Inject(LOCALE_ID) public locale: string,
    @Inject(MAT_KEYBOARD_LAYOUTS) private _layouts: IKeyboardLayouts
  ) {}

  ngOnInit(): void {
    this.defaultLocale = ` ${this.locale}`.slice(1);
    this.layouts = Object.keys(this._layouts)
      .map((name: string) => ({
        name,
        layout: this._layouts[name]
      }))
      .sort((a, b) => a.layout.name.localeCompare(b.layout.name));
  }

  ngOnDestroy(): void {
    this.closeCurrentKeyboard();
  }

  submitForm(form?: NgForm): void {
    const submittedForms = this._submittedForms.getValue();
    const submittedForm = Object.keys(form.controls).map((control: string) => ({
      control,
      value: form.controls[control].value
    }));
    submittedForms.push(submittedForm);
    this._submittedForms.next(submittedForms);
  }

  openKeyboard(locale: string = this.defaultLocale): void {
    this._keyboardRef = this._keyboardService.open(locale, {
      duration: this.duration
    });
    if (this._enterSubscription) {
      this._enterSubscription.unsubscribe();
    }
    this._enterSubscription = this._keyboardRef.keyboardInstance.enterClick.subscribe(() => {
      this.submitForm();
    });
  }

  closeCurrentKeyboard(): void {
    if (this._keyboardRef) {
      this._keyboardRef.dismiss();
    }

    if (this._enterSubscription) {
      this._enterSubscription.unsubscribe();
    }
  }

  openAttachedKeyboard(locale: string = this.defaultLocale): void {
    this._keyboardRef = this._keyboardService.open(locale, {
      duration: this.duration
    });

    // reference the input element
    this._keyboardRef.keyboardInstance.setInputInstance(this._attachToElement);

    // set control
    this._keyboardRef.keyboardInstance.attachControl(this._attachToControl.control);
  }
}
