import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  LOCALE_ID,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
  TrackByFunction
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { MatKeyboardKeyComponent } from '../keyboard-key/keyboard-key.component';
import { KeyboardModifier } from '../keyboard-modifier';
import { IKeyboardLayout } from '../keyboard-layouts-config';
import { MatKeyboardRef } from '../keyboard-ref';
import { SpecialKey } from '../special-key';
import { MatKeyboardLayout } from '../keyboard-layout.service';

function _invertShiftModifier(modifier: KeyboardModifier): KeyboardModifier {
  switch (modifier) {
    case KeyboardModifier.None:
      return KeyboardModifier.Shift;
    case KeyboardModifier.Alt:
      return KeyboardModifier.ShiftAlt;
    case KeyboardModifier.ShiftAlt:
      return KeyboardModifier.Alt;
    case KeyboardModifier.Shift:
      return KeyboardModifier.None;
  }
}

function _invertAltModifier(modifier: KeyboardModifier): KeyboardModifier {
  switch (modifier) {
    case KeyboardModifier.None:
      return KeyboardModifier.Alt;
    case KeyboardModifier.Shift:
      return KeyboardModifier.ShiftAlt;
    case KeyboardModifier.ShiftAlt:
      return KeyboardModifier.Shift;
    case KeyboardModifier.Alt:
      return KeyboardModifier.None;
  }
}

/**
 * A component used to open as the default keyboard, matching material spec.
 * This should only be used internally by the keyboard service.
 */
@Component({
  selector: 'mat-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'mat-keyboard'
  }
})
export class MatKeyboardComponent implements OnInit {
  private readonly _inputInstance$ = new BehaviorSubject<ElementRef | null>(null);

  private _modifier = KeyboardModifier.None;

  private _capsLocked = false;

  @ViewChildren(MatKeyboardKeyComponent)
  keys: QueryList<MatKeyboardKeyComponent>;

  // the service provides a locale or layout optionally
  locale?: string;

  layout: IKeyboardLayout;

  control: AbstractControl;

  // the instance of the component making up the content of the keyboard
  keyboardRef: MatKeyboardRef;

  readonly enterClick = new EventEmitter<void>();

  readonly capsClick = new EventEmitter<void>();

  readonly altClick = new EventEmitter<void>();

  readonly shiftClick = new EventEmitter<void>();

  /** An observable of the input instance */
  readonly inputInstance = this._inputInstance$.asObservable();

  constructor(@Inject(LOCALE_ID) private _locale: string, private _keyboardLayout: MatKeyboardLayout) {}

  ngOnInit(): void {
    // set a fallback using the locale
    if (!this.layout) {
      this.locale = this._keyboardLayout.mapLocale(this._locale) ? this._locale : 'en-US';
      this.layout = this._keyboardLayout.getLocaleLayout(this.locale);
    }
  }

  /**
   * listens to users keyboard inputs to simulate on virtual keyboard, too
   * @param event
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // 'activate' corresponding key
    this.keys
      .filter(key => key.key === event.key)
      .forEach(key => {
        key.pressed = true;
      });

    // simulate modifier press
    if (event.key === SpecialKey.Caps) {
      this.onCapsClick(event.getModifierState(SpecialKey.Caps));
    }
    if (
      event.key === SpecialKey.Alt &&
      this._modifier !== KeyboardModifier.Alt &&
      this._modifier !== KeyboardModifier.ShiftAlt
    ) {
      this.onAltClick();
    }
    if (
      event.key === SpecialKey.Shift &&
      this._modifier !== KeyboardModifier.Shift &&
      this._modifier !== KeyboardModifier.ShiftAlt
    ) {
      this.onShiftClick();
    }
  }

  /**
   * listens to users keyboard inputs to simulate on virtual keyboard, too
   * @param event
   */
  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    // 'deactivate' corresponding key
    this.keys
      .filter((key: MatKeyboardKeyComponent) => key.key === event.key)
      .forEach((key: MatKeyboardKeyComponent) => {
        key.pressed = false;
      });

    // simulate modifier release
    if (
      event.key === SpecialKey.Alt &&
      (this._modifier === KeyboardModifier.Alt || this._modifier === KeyboardModifier.ShiftAlt)
    ) {
      this.onAltClick();
    }
    if (
      event.key === SpecialKey.Shift &&
      (this._modifier === KeyboardModifier.Shift || this._modifier === KeyboardModifier.ShiftAlt)
    ) {
      this.onShiftClick();
    }
  }

  trackKey: TrackByFunction<string | SpecialKey> = (_index, item) => item;

  setInputInstance(inputInstance: ElementRef): void {
    this._inputInstance$.next(inputInstance);
  }

  attachControl(control: AbstractControl): void {
    this.control = control;
  }

  /**
   * dismisses the keyboard
   */
  dismiss(): void {
    this.keyboardRef.dismiss();
  }

  /**
   * checks if a given key is currently pressed
   * @param key
   * @param
   */
  isActive(key: (string | SpecialKey)[]): boolean {
    const modifiedKey = this.getModifiedKey(key);
    const isActiveCapsLock = modifiedKey === SpecialKey.Caps && this._capsLocked;
    const isActiveModifier = modifiedKey === KeyboardModifier[this._modifier];
    return isActiveCapsLock || isActiveModifier;
  }

  // retrieves modified key
  getModifiedKey(key: (string | SpecialKey)[]): string {
    let modifier = this._modifier;

    // `CapsLock` inverts the meaning of `Shift`
    if (this._capsLocked) {
      modifier = _invertShiftModifier(this._modifier);
    }

    return key[modifier];
  }

  /**
   * bubbles event if submit is potentially triggered
   */
  onEnterClick(): void {
    // notify subscribers
    this.enterClick.next();
  }

  /**
   * simulates clicking `CapsLock` key
   * @param capsLocked wether the caps modifier is active or not
   */
  onCapsClick(capsLocked: boolean = !this._capsLocked): void {
    // not implemented
    this._capsLocked = capsLocked;

    // notify subscribers
    this.capsClick.next();
  }

  /**
   * simulates clicking `Alt` key
   */
  onAltClick(): void {
    // invert modifier meaning
    this._modifier = _invertAltModifier(this._modifier);

    // notify subscribers
    this.altClick.next();
  }

  /**
   * simulates clicking `Shift` key
   */
  onShiftClick(): void {
    // invert modifier meaning
    this._modifier = _invertShiftModifier(this._modifier);

    // notify subscribers
    this.shiftClick.next();
  }
}
