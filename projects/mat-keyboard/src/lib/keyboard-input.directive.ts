import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Optional,
  Output,
  Self
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { MatKeyboardRef } from './keyboard-ref';
import { MatKeyboard } from './keyboard.service';

@Directive({
  selector: 'input[matKeyboard], textarea[matKeyboard]'
})
export class MatKeyboardInput implements OnDestroy {
  private _keyboardRef: MatKeyboardRef;

  @Input() matKeyboard: string;

  @Input() duration: number;

  @Output() enterClick: EventEmitter<void> = new EventEmitter<void>();

  @Output() capsClick: EventEmitter<void> = new EventEmitter<void>();

  @Output() altClick: EventEmitter<void> = new EventEmitter<void>();

  @Output() shiftClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private _elementRef: ElementRef,
    private _keyboardService: MatKeyboard,
    @Optional() @Self() private _control?: NgControl
  ) {}

  ngOnDestroy(): void {
    this.hideKeyboard();
  }

  @HostListener('focus')
  showKeyboard(): void {
    this._keyboardRef = this._keyboardService.open(this.matKeyboard, {
      duration: this.duration
    });

    // reference the input element
    this._keyboardRef.keyboardInstance.setInputInstance(this._elementRef);

    // set control if given, cast to smth. non-abstract
    if (this._control) {
      this._keyboardRef.keyboardInstance.attachControl(this._control.control);
    }

    // connect outputs
    this._keyboardRef.keyboardInstance.enterClick.subscribe(this.enterClick);
    this._keyboardRef.keyboardInstance.capsClick.subscribe(this.capsClick);
    this._keyboardRef.keyboardInstance.altClick.subscribe(this.altClick);
    this._keyboardRef.keyboardInstance.shiftClick.subscribe(this.shiftClick);
  }

  @HostListener('blur')
  hideKeyboard(): void {
    if (this._keyboardRef) {
      this._keyboardRef.dismiss();
    }
  }
}
