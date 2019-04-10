import { AnimationEvent } from '@angular/animations';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  EmbeddedViewRef,
  HostBinding,
  HostListener,
  NgZone,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { MatKeyboardConfig } from '../keyboard-config';
import { KeyboardAnimationState, matKeyboardAnimations } from '../keyboard-animations';

/**
 * Outlet for a keyboard
 */
@Component({
  selector: 'mat-keyboard-container',
  templateUrl: './keyboard-container.component.html',
  styleUrls: ['./keyboard-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mat-keyboard-container',
    role: 'alert'
  },
  encapsulation: ViewEncapsulation.None,
  animations: [matKeyboardAnimations.keyboardContainer]
})
export class MatKeyboardContainerComponent extends BasePortalOutlet implements OnDestroy {
  /** Whether the component has been destroyed. */
  private _destroyed = false;

  /** The portal outlet inside of this container into which the keyboard content will be loaded. */
  @ViewChild(CdkPortalOutlet)
  _portalOutlet: CdkPortalOutlet;

  /** The state of the keyboard animations. */
  @HostBinding('@keyboardContainer')
  _animationState = KeyboardAnimationState.Void;

  /** Subject for notifying that the keyboard has exited from view. */
  readonly onExit = new Subject<void>();

  /** Subject for notifying that the keyboard has finished entering the view. */
  readonly onEnter = new Subject<void>();

  // the keyboard configuration
  keyboardConfig: MatKeyboardConfig;

  constructor(private _ngZone: NgZone, private _changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  ngOnDestroy(): void {
    this._destroyed = true;
    this._completeExit();
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent): void {
    // TODO: revisit
    event.preventDefault();
  }

  /**
   * Attach a component portal as content to this keyboard container.
   */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached()) {
      throw Error('Attempting to attach keyboard content after content is already attached');
    }

    return this._portalOutlet.attachComponentPortal(portal);
  }

  /**
   * Attach a template portal as content to this keyboard container
   */
  attachTemplatePortal(): EmbeddedViewRef<any> {
    throw Error('Not yet implemented');
  }

  /** Callback, invoked whenever an animation on the host completes. */
  @HostListener('@keyboardContainer.done', ['$event'])
  _onAnimationEnd(event: AnimationEvent): void {
    const { fromState, toState } = event;

    if (
      (toState === KeyboardAnimationState.Void && fromState !== KeyboardAnimationState.Void) ||
      toState === KeyboardAnimationState.Hidden
    ) {
      this._completeExit();
    } else if (toState === KeyboardAnimationState.Visible) {
      // Note: we shouldn't use `this` inside the zone callback,
      // because it can cause a memory leak.
      const onEnter = this.onEnter;

      this._ngZone.run(() => {
        onEnter.next();
        onEnter.complete();
      });
    }
  }

  /** Begin animation of keyboard entrance into view. */
  enter(): void {
    if (!this._destroyed) {
      this._animationState = KeyboardAnimationState.Visible;
      this._changeDetectorRef.detectChanges();
    }
  }

  /** Begin animation of keyboard exiting from view. */
  exit(): void {
    this._animationState = KeyboardAnimationState.Hidden;
  }

  private _completeExit(): void {
    // Waits for the zone to settle before removing the element.
    // Helps prevent errors where we end up removing an element which is in the middle of an animation.
    this._ngZone.onMicrotaskEmpty
      .asObservable()
      .pipe(first())
      .subscribe(() => {
        this.onExit.next();
        this.onExit.complete();
      });
  }
}
