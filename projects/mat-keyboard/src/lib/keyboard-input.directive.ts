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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatKeyboardRef } from './keyboard-ref';
import { MatKeyboard } from './keyboard.service';

@Directive({
  selector: 'input[matKeyboard], textarea[matKeyboard]',
  host: {
    '[attr.aria-haspopup]': 'true'
  },
  exportAs: 'matKeyboardInput'
})
export class MatKeyboardInput implements OnDestroy {
  private readonly _destroy = new Subject<void>();
  private _keyboardRef: MatKeyboardRef;

  @Input('matKeyboard') locale: string;

  @Input() duration: number;

  @Output() readonly enterClick = new EventEmitter<void>();

  @Output() readonly capsClick = new EventEmitter<void>();

  @Output() readonly altClick = new EventEmitter<void>();

  @Output() readonly shiftClick = new EventEmitter<void>();

  constructor(
    private readonly _elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    private readonly _keyboardService: MatKeyboard,
    @Optional() @Self() private readonly _control?: NgControl
  ) {}

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
    this.hideKeyboard();
  }

  @HostListener('focus')
  showKeyboard(): void {
    this._keyboardRef = this._keyboardService.open(this.locale, {
      duration: this.duration
    });

    this._keyboardRef.keyboardInstance.setInputInstance(this._elementRef);

    // set control if given, cast to smth. non-abstract
    if (this._control) {
      this._keyboardRef.keyboardInstance.attachControl(this._control.control);
    }
    this._keyboardRef.keyboardInstance.enterClick.pipe(takeUntil(this._destroy)).subscribe(this.enterClick);
    this._keyboardRef.keyboardInstance.capsClick.pipe(takeUntil(this._destroy)).subscribe(this.capsClick);
    this._keyboardRef.keyboardInstance.altClick.pipe(takeUntil(this._destroy)).subscribe(this.altClick);
    this._keyboardRef.keyboardInstance.shiftClick.pipe(takeUntil(this._destroy)).subscribe(this.shiftClick);
  }

  @HostListener('blur')
  hideKeyboard(): void {
    if (this._keyboardRef) {
      this._keyboardRef.dismiss();
    }
  }
}
