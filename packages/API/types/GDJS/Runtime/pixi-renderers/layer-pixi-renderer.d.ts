declare namespace gdjs {
    import PIXI = GlobalPIXIModule.PIXI;
    /**
     * The renderer for a gdjs.Layer using Pixi.js.
     */
    class LayerPixiRenderer {
        _pixiContainer: PIXI.Container;
        _filters: Record<string, gdjs.PixiFiltersTools.Filter>;
        _layer: any;
        _renderTexture: PIXI.RenderTexture | null;
        _lightingSprite: PIXI.Sprite | null;
        _runtimeSceneRenderer: any;
        _pixiRenderer: PIXI.Renderer | null;
        _oldWidth: float | null;
        _oldHeight: float | null;
        _isLightingLayer: boolean;
        _clearColor: Array<integer>;
        /**
         * @param layer The layer
         * @param runtimeSceneRenderer The scene renderer
         */
        constructor(layer: gdjs.Layer, runtimeSceneRenderer: gdjs.RuntimeScenePixiRenderer);
        getRendererObject(): PIXI.Container;
        getLightingSprite(): PIXI.Sprite | null;
        /**
         * Update the position of the PIXI container. To be called after each change
         * made to position, zoom or rotation of the camera.
         */
        updatePosition(): void;
        updateVisibility(visible: boolean): void;
        update(): void;
        /**
         * Add a new effect, or replace the one with the same name.
         * @param effectData The data of the effect to add.
         */
        addEffect(effectData: EffectData): void;
        /**
         * Remove the effect with the specified name
         * @param effectName The name of the effect.
         */
        removeEffect(effectName: string): void;
        /**
         * Add a child to the pixi container associated to the layer.
         * All objects which are on this layer must be children of this container.
         *
         * @param child The child (PIXI object) to be added.
         * @param zOrder The z order of the associated object.
         */
        addRendererObject(child: any, zOrder: integer): void;
        /**
         * Change the z order of a child associated to an object.
         *
         * @param child The child (PIXI object) to be modified.
         * @param newZOrder The z order of the associated object.
         */
        changeRendererObjectZOrder(child: any, newZOrder: integer): void;
        /**
         * Remove a child from the internal pixi container.
         * Should be called when an object is deleted or removed from the layer.
         *
         * @param child The child (PIXI object) to be removed.
         */
        removeRendererObject(child: any): void;
        /**
         * Update the parameter of an effect (with a number).
         * @param name The effect name
         * @param parameterName The parameter name
         * @param value The new value for the parameter
         */
        setEffectDoubleParameter(name: string, parameterName: string, value: float): void;
        /**
         * Update the parameter of an effect (with a string).
         * @param name The effect name
         * @param parameterName The parameter name
         * @param value The new value for the parameter
         */
        setEffectStringParameter(name: string, parameterName: string, value: string): void;
        /**
         * Enable or disable the parameter of an effect (boolean).
         * @param name The effect name
         * @param parameterName The parameter name
         * @param value The new value for the parameter
         */
        setEffectBooleanParameter(name: string, parameterName: string, value: boolean): void;
        /**
         * Check if an effect exists.
         * @param name The effect name
         * @returns True if the effect exists, false otherwise
         */
        hasEffect(name: string): boolean;
        /**
         * Enable an effect.
         * @param name The effect name
         * @param value Set to true to enable, false to disable
         */
        enableEffect(name: string, value: boolean): void;
        /**
         * Check if an effect is enabled.
         * @param name The effect name
         * @return true if the filter is enabled
         */
        isEffectEnabled(name: string): boolean;
        updateClearColor(): void;
        /**
         * Updates the render texture, if it exists.
         * Also, render texture is cleared with a specified clear color.
         */
        _updateRenderTexture(): void;
        /**
         * Enable the use of a PIXI.RenderTexture to render the PIXI.Container
         * of the layer and, in the scene PIXI container, replace the container
         * of the layer by a sprite showing this texture.
         * used only in lighting for now as the sprite could have MULTIPLY blend mode.
         */
        private _replaceContainerWithSprite;
    }
    type LayerRenderer = gdjs.LayerPixiRenderer;
    const LayerRenderer: typeof LayerPixiRenderer;
}
