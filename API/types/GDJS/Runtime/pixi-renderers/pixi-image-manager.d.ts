declare namespace gdjs {
    import PIXI = GlobalPIXIModule.PIXI;
    /**
     * PixiImageManager loads and stores textures that can be used by the Pixi.js renderers.
     */
    class PixiImageManager {
        _resources: any;
        _invalidTexture: any;
        _loadedTextures: any;
        /**
         * @param resources The resources data of the game.
         */
        constructor(resources: ResourceData[]);
        /**
         * Update the resources data of the game. Useful for hot-reloading, should not be used otherwise.
         *
         * @param resources The resources data of the game.
         */
        setResources(resources: ResourceData[]): void;
        /**
         * Return the PIXI texture associated to the specified resource name.
         * Returns a placeholder texture if not found.
         * @param resourceName The name of the resource
         * @returns The requested texture, or a placeholder if not found.
         */
        getPIXITexture(resourceName: string): PIXI.Texture;
        /**
         * Return the PIXI video texture associated to the specified resource name.
         * Returns a placeholder texture if not found.
         * @param resourceName The name of the resource to get.
         */
        getPIXIVideoTexture(resourceName: string): any;
        /**
         * Return a PIXI texture which can be used as a placeholder when no
         * suitable texture can be found.
         */
        getInvalidPIXITexture(): any;
        /**
         * Load the specified resources, so that textures are loaded and can then be
         * used by calling `getPIXITexture`.
         * @param onProgress Callback called each time a new file is loaded.
         * @param onComplete Callback called when loading is done.
         */
        loadTextures(onProgress: any, onComplete: any): any;
    }
    const ImageManager: typeof PixiImageManager;
    type ImageManager = gdjs.PixiImageManager;
}
