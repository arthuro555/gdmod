declare namespace gdjs {
    type Touch = {
        x: float;
        y: float;
        justEnded: boolean;
    };
    /**
     * Store input made on a canvas: mouse position, key pressed
     * and touches states.
     */
    export class InputManager {
        static MOUSE_LEFT_BUTTON: integer;
        static MOUSE_RIGHT_BUTTON: integer;
        static MOUSE_MIDDLE_BUTTON: integer;
        /**
         * Holds the raw keyCodes of the keys which only have left/right
         * variants and should default to their left variant values
         * if location is not specified.
         */
        static _DEFAULT_LEFT_VARIANT_KEYS: integer[];
        _pressedKeys: Hashtable<boolean>;
        _releasedKeys: Hashtable<boolean>;
        _lastPressedKey: float;
        _pressedMouseButtons: Array<boolean>;
        _releasedMouseButtons: Array<boolean>;
        _mouseX: float;
        _mouseY: float;
        _mouseWheelDelta: float;
        _touches: Hashtable<Touch>;
        _startedTouches: Array<integer>;
        _endedTouches: Array<integer>;
        _touchSimulateMouse: boolean;
        constructor();
        /**
         * Returns the "location-aware" keyCode, given a raw keyCode
         * and location. The location corresponds to KeyboardEvent.location,
         * which should be 0 for standard keys, 1 for left keys,
         * 2 for right keys, and 3 for numpad keys.
         *
         * @param keyCode The raw key code
         * @param location The location
         */
        _getLocationAwareKeyCode(keyCode: number, location: number | null | undefined): integer;
        /**
         * Should be called whenever a key is pressed. The location corresponds to
         * KeyboardEvent.location, which should be 0 for standard keys, 1 for left keys,
         * 2 for right keys, and 3 for numpad keys.
         * @param keyCode The raw key code associated to the key press.
         * @param location The location of the event.
         */
        onKeyPressed(keyCode: number, location?: number): void;
        /**
         * Should be called whenever a key is released. The location corresponds to
         * KeyboardEvent.location, which should be 0 for standard keys, 1 for left keys,
         * 2 for right keys, and 3 for numpad keys.
         * @param keyCode The raw key code associated to the key release.
         * @param location The location of the event.
         */
        onKeyReleased(keyCode: number, location?: number): void;
        /**
         * Return the location-aware code of the last key that was pressed.
         * @return The location-aware code of the last key pressed.
         */
        getLastPressedKey(): number;
        /**
         * Return true if the key corresponding to the location-aware keyCode is pressed.
         * @param locationAwareKeyCode The location-aware key code to be tested.
         */
        isKeyPressed(locationAwareKeyCode: number): boolean;
        /**
         * Return true if the key corresponding to the location-aware keyCode was released during the last frame.
         * @param locationAwareKeyCode The location-aware key code to be tested.
         */
        wasKeyReleased(locationAwareKeyCode: number): boolean;
        /**
         * Return true if any key is pressed.
         * @return true if any key is pressed.
         */
        anyKeyPressed(): boolean;
        /**
         * Return true if any key is released.
         * @return true if any key is released.
         */
        anyKeyReleased(): boolean;
        /**
         * Should be called when the mouse is moved.
         *
         * Please note that the coordinates must be expressed relative to the view position.
         *
         * @param x The mouse new X position
         * @param y The mouse new Y position
         */
        onMouseMove(x: float, y: float): void;
        /**
         * Get the mouse X position.
         *
         * @return the mouse X position, relative to the game view.
         */
        getMouseX(): float;
        /**
         * Get the mouse Y position.
         *
         * @return the mouse Y position, relative to the game view.
         */
        getMouseY(): float;
        /**
         * Should be called whenever a mouse button is pressed.
         * @param buttonCode The mouse button code associated to the event.
         * See InputManager.MOUSE_LEFT_BUTTON, InputManager.MOUSE_RIGHT_BUTTON, InputManager.MOUSE_MIDDLE_BUTTON
         */
        onMouseButtonPressed(buttonCode: number): void;
        /**
         * Should be called whenever a mouse button is released.
         * @param buttonCode The mouse button code associated to the event. (see onMouseButtonPressed)
         */
        onMouseButtonReleased(buttonCode: number): void;
        /**
         * Return true if the mouse button corresponding to buttonCode is pressed.
         * @param buttonCode The mouse button code (0: Left button, 1: Right button).
         */
        isMouseButtonPressed(buttonCode: number): boolean;
        /**
         * Return true if the mouse button corresponding to buttonCode was just released.
         * @param buttonCode The mouse button code (0: Left button, 1: Right button).
         */
        isMouseButtonReleased(buttonCode: number): boolean;
        /**
         * Should be called whenever the mouse wheel is used
         * @param wheelDelta The mouse wheel delta
         */
        onMouseWheel(wheelDelta: number): void;
        /**
         * Return the mouse wheel delta
         */
        getMouseWheelDelta(): float;
        /**
         * Get a touch X position.
         *
         * @return the touch X position, relative to the game view.
         */
        getTouchX(identifier: integer): float;
        /**
         * Get a touch Y position.
         *
         * @return the touch Y position, relative to the game view.
         */
        getTouchY(identifier: integer): float;
        /**
         * Update and return the array containing the identifiers of all touches.
         */
        getAllTouchIdentifiers(): Array<integer>;
        onTouchStart(identifier: integer, x: float, y: float): void;
        onTouchMove(identifier: integer, x: float, y: float): void;
        onTouchEnd(identifier: number): void;
        getStartedTouchIdentifiers(): integer[];
        popStartedTouch(): integer | undefined;
        popEndedTouch(): integer | undefined;
        /**
         * Set if touch events should simulate mouse events.
         *
         * If true, any touch will move the mouse position and set mouse buttons
         * as pressed/released.
         * @param enable true to simulate mouse events, false to disable it.
         */
        touchSimulateMouse(enable: boolean): void;
        /**
         * Notify the input manager that the frame ended, so anything that last
         * only for one frame (started/ended touches) should be reset.
         *
         * This method should be called in the game loop (see `gdjs.RuntimeGame.startGameLoop`).
         * You don't need to call it otherwise.
         */
        onFrameEnded(): void;
        /**
         * Return true if the mouse wheel scroll to up
         */
        isScrollingUp(): boolean;
        /**
         * Return true if the mouse wheel scroll to down
         */
        isScrollingDown(): boolean;
        static _allTouchIds: Array<integer>;
    }
    export {};
}
