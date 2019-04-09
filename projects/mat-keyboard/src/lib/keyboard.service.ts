import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Inject, Injectable, LOCALE_ID, Optional, SkipSelf } from '@angular/core';

import { MatKeyboardRef } from './keyboard-ref';
import { MatKeyboardContainerComponent } from './keyboard-container/keyboard-container.component';
import { MatKeyboardComponent } from './keyboard/keyboard.component';
import { MatKeyboardConfig, _applyConfigDefaults } from './keyboard-config';
import { MatKeyboardLayout } from './keyboard-layout.service';

/**
 * Service to dispatch Material Design keyboard.
 */
@Injectable()
export class MatKeyboard {
  /**
   * Reference to the current keyboard in the view *at this level* (in the Angular injector tree).
   * If there is a parent keyboard service, all operations should delegate to that parent
   * via `_openedKeyboardRef`.
   */
  private _keyboardRefAtThisLevel: MatKeyboardRef | null = null;

  /** Reference to the currently opened keyboard at *any* level. */
  private get _openedKeyboardRef(): MatKeyboardRef | null {
    const parent = this._parentKeyboard;
    return parent ? parent._openedKeyboardRef : this._keyboardRefAtThisLevel;
  }

  private set _openedKeyboardRef(value: MatKeyboardRef | null) {
    if (this._parentKeyboard) {
      this._parentKeyboard._openedKeyboardRef = value;
    } else {
      this._keyboardRefAtThisLevel = value;
    }
  }

  get isOpened(): boolean {
    return !!this._openedKeyboardRef;
  }

  constructor(
    private _overlay: Overlay,
    private _live: LiveAnnouncer,
    private _keyboardLayout: MatKeyboardLayout,
    @Inject(LOCALE_ID) private _defaultLocale: string,
    @Optional() @SkipSelf() private _parentKeyboard: MatKeyboard
  ) {}

  /**
   * Creates and dispatches a keyboard with a custom component for the content, removing any
   * currently opened keyboards.
   *
   * @param layoutOrLocale layout or locale to use.
   * @param config Extra configuration for the keyboard.
   */
  openFromComponent(layoutOrLocale: string, config: Partial<MatKeyboardConfig>): MatKeyboardRef {
    const _config = _applyConfigDefaults(config);
    const keyboardRef = this._attachKeyboardContent(_config);

    // a locale is provided
    if (this._keyboardLayout.isLocaleAvailable(layoutOrLocale)) {
      keyboardRef.instance.locale = layoutOrLocale;
      keyboardRef.instance.layout = this._keyboardLayout.getLocaleLayout(layoutOrLocale);
    }

    // a layout name is provided
    if (this._keyboardLayout.isLayoutAvailable(layoutOrLocale)) {
      const layout = this._keyboardLayout.getLayout(layoutOrLocale);
      keyboardRef.instance.layout = layout;
      keyboardRef.instance.locale = layout.lang && layout.lang[-1];
    }

    // When the keyboard is dismissed, lower the keyboard counter.
    keyboardRef.afterDismissed().subscribe(() => {
      // Clear the keyboard ref if it hasn't already been replaced by a newer keyboard.
      if (this._openedKeyboardRef === keyboardRef) {
        this._openedKeyboardRef = null;
      }
    });

    if (this._openedKeyboardRef) {
      // If a keyboard is already in view, dismiss it and enter the
      // new keyboard after exit animation is complete.
      this._openedKeyboardRef.afterDismissed().subscribe(() => {
        keyboardRef.containerInstance.enter();
      });
      this._openedKeyboardRef.dismiss();
    } else {
      // If no keyboard is in view, enter the new keyboard.
      keyboardRef.containerInstance.enter();
    }

    if (_config.announcementMessage) {
      this._live.announce(_config.announcementMessage, _config.politeness);
    }

    this._openedKeyboardRef = keyboardRef;
    return this._openedKeyboardRef;
  }

  /**
   * Opens a keyboard with a message and an optional action.
   * @param layoutOrLocale A string representing the locale or the layout name to be used.
   * @param config Additional configuration options for the keyboard.
   */
  open(layoutOrLocale?: string, config?: Partial<MatKeyboardConfig>): MatKeyboardRef {
    return this.openFromComponent(layoutOrLocale || this._defaultLocale, config || {});
  }

  /**
   * Dismisses the currently-visible keyboard.
   */
  dismiss() {
    if (this._openedKeyboardRef) {
      this._openedKeyboardRef.dismiss();
    }
  }

  /**
   * Attaches the keyboard container component to the overlay.
   */
  private _attachKeyboardContainer(overlayRef: OverlayRef, config: MatKeyboardConfig): MatKeyboardContainerComponent {
    const containerPortal = new ComponentPortal(MatKeyboardContainerComponent, config.viewContainerRef);
    const containerRef = overlayRef.attach(containerPortal);

    // set config
    containerRef.instance.keyboardConfig = config;

    return containerRef.instance;
  }

  /**
   * Places a new component as the content of the keyboard container.
   */
  private _attachKeyboardContent(config: MatKeyboardConfig): MatKeyboardRef {
    const overlayRef = this._createOverlay();
    const container = this._attachKeyboardContainer(overlayRef, config);
    const portal = new ComponentPortal(MatKeyboardComponent);
    const contentRef = container.attachComponentPortal(portal);
    return new MatKeyboardRef(contentRef.instance, container, overlayRef);
  }

  /**
   * Creates a new overlay and places it in the correct location.
   */
  private _createOverlay(): OverlayRef {
    const state = new OverlayConfig({
      width: '100%'
    });

    state.positionStrategy = this._overlay
      .position()
      .global()
      .centerHorizontally()
      .bottom('0');

    return this._overlay.create(state);
  }
}
