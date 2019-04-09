import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';

import { MatKeyboardComponent } from './keyboard/keyboard.component';
import { MatKeyboardContainerComponent } from './keyboard-container/keyboard-container.component';

/**
 * Reference to a keyboard dispatched from the keyboard service.
 */
export class MatKeyboardRef {
  /** Subject for notifying the user that the keyboard has closed. */
  private readonly _afterDismissed = new Subject<void>();

  /**
   * Creates a new instance
   * @param keyboardInstance The instance of the component making up the content of the keyboard.
   * @param containerInstance The instance of the component making up the content of the keyboard.
   * @param _overlayRef The overlay ref
   */
  constructor(
    public keyboardInstance: MatKeyboardComponent,
    public readonly containerInstance: MatKeyboardContainerComponent,
    private _overlayRef: OverlayRef
  ) {
    // Finish dismiss on exitting
    containerInstance.onExit.subscribe(() => this._finishDismiss());
  }

  /** Dismisses the keyboard. */
  dismiss(): void {
    if (!this._afterDismissed.closed) {
      this.containerInstance.exit();
    }
  }

  /** Gets an observable that is notified when the keyboard is finished closing. */
  afterDismissed(): Observable<void> {
    return this._afterDismissed.asObservable();
  }

  /** Gets an observable that is notified when the keyboard has opened and appeared. */
  afterOpened(): Observable<void> {
    return this.containerInstance.onEnter;
  }

  /** Cleans up the DOM after closing. */
  private _finishDismiss(): void {
    this.keyboardInstance = null;
    this._overlayRef.dispose();
    this._afterDismissed.next();
    this._afterDismissed.complete();
  }
}
