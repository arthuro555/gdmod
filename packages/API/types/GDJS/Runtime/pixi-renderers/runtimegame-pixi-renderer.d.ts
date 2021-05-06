declare namespace gdjs {
    import PIXI = GlobalPIXIModule.PIXI;
    /**
     * The renderer for a gdjs.RuntimeGame using Pixi.js.
     */
    class RuntimeGamePixiRenderer {
        _game: any;
        _isFullPage: boolean;
        _isFullscreen: boolean;
        _forceFullscreen: any;
        _pixiRenderer: PIXI.Renderer | null;
        _canvasWidth: float;
        _canvasHeight: float;
        _keepRatio: boolean;
        _marginLeft: any;
        _marginTop: any;
        _marginRight: any;
        _marginBottom: any;
        _notifySceneForResize: any;
        /**
         * @param game The game that is being rendered
         * @param forceFullscreen If fullscreen should be always activated
         */
        constructor(game: gdjs.RuntimeGame, forceFullscreen: boolean);
        /**
         * Create a standard canvas inside canvasArea.
         *
         */
        createStandardCanvas(parentElement: any): PIXI.Renderer;
        static getWindowInnerWidth(): number;
        static getWindowInnerHeight(): number;
        /**
         * Update the game renderer size according to the "game resolution".
         * Called when game resolution changes.
         *
         * Note that if the canvas is fullscreen, it won't be resized, but when going back to
         * non fullscreen mode, the requested size will be used.
         */
        updateRendererSize(): void;
        /**
         * Set the proper screen orientation from the project properties.
         */
        private _setupOrientation;
        /**
         * Resize the renderer (the "game resolution") and the canvas (which can be larger
         * or smaller to fill the page, with optional margins).
         *
         */
        private _resizeCanvas;
        /**
         * Set if the aspect ratio must be kept when the game canvas is resized to fill
         * the page.
         */
        keepAspectRatio(enable: any): void;
        /**
         * Change the margin that must be preserved around the game canvas.
         */
        setMargins(top: any, right: any, bottom: any, left: any): void;
        /**
         * Update the window size, if possible.
         * @param width The new width, in pixels.
         * @param height The new height, in pixels.
         */
        setWindowSize(width: float, height: float): void;
        /**
         * Center the window on screen.
         */
        centerWindow(): void;
        /**
         * De/activate fullscreen for the game.
         */
        setFullScreen(enable: any): void;
        /**
         * Checks if the game is in full screen.
         */
        isFullScreen(): boolean;
        /**
         * Add the standard events handler.
         */
        bindStandardEvents(manager: any, window: any, document: any): void;
        setWindowTitle(title: any): void;
        getWindowTitle(): string;
        startGameLoop(fn: any): void;
        getPIXIRenderer(): PIXI.Renderer | null;
        /**
         * Open the given URL in the system browser (or a new tab)
         */
        openURL(url: string): void;
        /**
         * Close the game, if applicable
         */
        stopGame(): void;
        /**
         * Get the canvas DOM element.
         */
        getCanvas(): HTMLCanvasElement;
        /**
         * Check if the device supports WebGL.
         * @returns true if WebGL is supported
         */
        isWebGLSupported(): boolean;
        /**
         * Get the electron module, if running as a electron renderer process.
         */
        getElectron(): any;
    }
    type RuntimeGameRenderer = RuntimeGamePixiRenderer;
    const RuntimeGameRenderer: typeof RuntimeGamePixiRenderer;
}
