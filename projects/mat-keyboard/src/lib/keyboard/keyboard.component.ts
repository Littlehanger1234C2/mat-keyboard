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
import { BehaviorSubject, Observable } from 'rxjs';

import { MatKeyboardKeyComponent } from '../keyboard-key/keyboard-key.component';
import { KeyboardModifier } from '../keyboard-modifier';
import { IKeyboardLayout } from '../keyboard-layouts-config';
import { MatKeyboardRef } from '../keyboard-ref';
import { SpecialKey } from '../special-key';
import { MatKeyboardLayout } from '../keyboard-layout.service';

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
  private _isDebug: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private _inputInstance$: BehaviorSubject<ElementRef | null> = new BehaviorSubject(null);

  private _modifier: KeyboardModifier = KeyboardModifier.None;

  private _capsLocked = false;

  @ViewChildren(MatKeyboardKeyComponent)
  _keys: QueryList<MatKeyboardKeyComponent>;

  // the service provides a locale or layout optionally
  locale?: string;

  layout: IKeyboardLayout;

  control: AbstractControl;

  // the instance of the component making up the content of the keyboard
  keyboardRef: MatKeyboardRef;

  readonly enterClick: EventEmitter<void> = new EventEmitter<void>();

  readonly capsClick: EventEmitter<void> = new EventEmitter<void>();

  readonly altClick: EventEmitter<void> = new EventEmitter<void>();

  readonly shiftClick: EventEmitter<void> = new EventEmitter<void>();

  // returns an observable of the input instance
  get inputInstance(): Observable<ElementRef | null> {
    return this._inputInstance$.asObservable();
  }

  set isDebug(isDebug: boolean) {
    if (this._isDebug.getValue() !== isDebug) {
      this._isDebug.next(isDebug);
    }
  }

  get isDebug$(): Observable<boolean> {
    return this._isDebug.asObservable();
  }

  // inject dependencies
  constructor(@Inject(LOCALE_ID) private _locale: string, private _keyboardLayout: MatKeyboardLayout) {}

  ngOnInit() {
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
  onKeyDown(event: KeyboardEvent) {
    // 'activate' corresponding key
    this._keys
      .filter((key: MatKeyboardKeyComponent) => key.key === event.key)
      .forEach((key: MatKeyboardKeyComponent) => {
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
  onKeyUp(event: KeyboardEvent) {
    // 'deactivate' corresponding key
    this._keys
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

  setInputInstance(inputInstance: ElementRef) {
    this._inputInstance$.next(inputInstance);
  }

  attachControl(control: AbstractControl) {
    this.control = control;
  }

  /**
   * dismisses the keyboard
   */
  dismiss() {
    this.keyboardRef.dismiss();
  }

  /**
   * checks if a given key is currently pressed
   * @param key
   * @param
   */
  isActive(key: (string | SpecialKey)[]): boolean {
    const modifiedKey: string = this.getModifiedKey(key);
    const isActiveCapsLock: boolean = modifiedKey === SpecialKey.Caps && this._capsLocked;
    const isActiveModifier: boolean = modifiedKey === KeyboardModifier[this._modifier];
    return isActiveCapsLock || isActiveModifier;
  }

  // retrieves modified key
  getModifiedKey(key: (string | SpecialKey)[]): string {
    let modifier: KeyboardModifier = this._modifier;

    // `CapsLock` inverts the meaning of `Shift`
    if (this._capsLocked) {
      modifier = this._invertShiftModifier(this._modifier);
    }

    return key[modifier];
  }

  /**
   * bubbles event if submit is potentially triggered
   */
  onEnterClick() {
    // notify subscribers
    this.enterClick.next();
  }

  /**
   * simulates clicking `CapsLock` key
   * @param targetState
   */
  onCapsClick(targetState = !this._capsLocked) {
    // not implemented
    this._capsLocked = targetState;

    // notify subscribers
    this.capsClick.next();
  }

  /**
   * simulates clicking `Alt` key
   */
  onAltClick() {
    // invert modifier meaning
    this._modifier = this._invertAltModifier(this._modifier);

    // notify subscribers
    this.altClick.next();
  }

  /**
   * simulates clicking `Shift` key
   */
  onShiftClick() {
    // invert modifier meaning
    this._modifier = this._invertShiftModifier(this._modifier);

    // notify subscribers
    this.shiftClick.next();
  }

  private _invertAltModifier(modifier: KeyboardModifier): KeyboardModifier {
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

  private _invertShiftModifier(modifier: KeyboardModifier): KeyboardModifier {
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
}
