namespace GDAPI {
  /**
   * Tools to load GDevelop Extensions.
   * @memberof GDAPI
   * @namespace
   */
  export namespace extTools {
    /**
     * Contains the extension includes.
     * This is auto-generated.
     * See https://github.com/arthuro555/GDevelop/tree/gdmod-generate-includes-list.
     */
    const EXTENSIONS: Record<string, string[]> = {
      PlatformBehavior: [
        "Extensions/PlatformBehavior/platformruntimebehavior.js",
        "Extensions/PlatformBehavior/platformerobjectruntimebehavior.js",
        "PlatformBehavior/PlatformerObjectRuntimeBehavior.h",
      ],
      DestroyOutsideBehavior: [
        "Extensions/DestroyOutsideBehavior/destroyoutsideruntimebehavior.js",
      ],
      TiledSpriteObject: [
        "Extensions/TiledSpriteObject/tiledspriteruntimeobject.js",
        "Extensions/TiledSpriteObject/tiledspriteruntimeobject-pixi-renderer.js",
      ],
      DraggableBehavior: [
        "Extensions/DraggableBehavior/draggableruntimebehavior.js",
      ],
      TopDownMovementBehavior: [
        "Extensions/TopDownMovementBehavior/topdownmovementruntimebehavior.js",
      ],
      TextObject: [
        "Extensions/TextObject/textruntimeobject.js",
        "Extensions/TextObject/textruntimeobject-pixi-renderer.js",
      ],
      ParticleSystem: [
        "Extensions/ParticleSystem/particleemitterobject.js",
        "Extensions/ParticleSystem/particleemitterobject-pixi-renderer.js",
        "Extensions/ParticleSystem/pixi-particles-pixi-renderer.min.js",
        "ParticleSystem/ParticleEmitterObject.h",
      ],
      PanelSpriteObject: [
        "Extensions/PanelSpriteObject/panelspriteruntimeobject.js",
        "Extensions/PanelSpriteObject/panelspriteruntimeobject-pixi-renderer.js",
        "PanelSpriteObject/PanelSpriteObject.h",
        "Extensions/TiledSpriteObject/panelspriteruntimeobject.js",
      ],
      AnchorBehavior: ["Extensions/AnchorBehavior/anchorruntimebehavior.js"],
      PrimitiveDrawing: [
        "Extensions/PrimitiveDrawing/shapepainterruntimeobject.js",
        "Extensions/PrimitiveDrawing/shapepainterruntimeobject-pixi-renderer.js",
        "PrimitiveDrawing/ShapePainterObject.h",
      ],
      TextEntryObject: [
        "Extensions/TextEntryObject/textentryruntimeobject.js",
        "Extensions/TextEntryObject/textentryruntimeobject-pixi-renderer.js",
        "TextObject/TextObject.h",
      ],
      Inventory: [
        "Extensions/Inventory/inventory.js",
        "Extensions/Inventory/inventorytools.js",
      ],
      LinkedObjects: ["Extensions/LinkedObjects/linkedobjects.js"],
      SystemInfo: ["Extensions/SystemInfo/systeminfotools.js"],
      Shopify: [
        "Extensions/Shopify/shopify-buy.umd.polyfilled.min.js",
        "Extensions/Shopify/shopifytools.js",
      ],
      PathfindingBehavior: [
        "Extensions/PathfindingBehavior/pathfindingruntimebehavior.js",
        "Extensions/PathfindingBehavior/pathfindingobstacleruntimebehavior.js",
        "PathfindingBehavior/PathfindingObstacleRuntimeBehavior.h",
      ],
      PhysicsBehavior: [
        "Extensions/PhysicsBehavior/box2djs/box2d.js",
        "Extensions/PhysicsBehavior/physicsruntimebehavior.js",
      ],
      AdMob: ["Extensions/AdMob/admobtools.js"],
      AdvancedWindow: [
        "Extensions/AdvancedWindow/electron-advancedwindowtools.js",
      ],
      BBText: [
        "Extensions/BBText/bbtextruntimeobject.js",
        "Extensions/BBText/bbtextruntimeobject-pixi-renderer.js",
        "Extensions/BBText/pixi-multistyle-text/dist/pixi-multistyle-text.umd.js",
      ],
      DebuggerTools: ["Extensions/DebuggerTools/debuggertools.js"],
      DeviceSensors: ["Extensions/DeviceSensors/devicesensortools.js"],
      DeviceVibration: ["Extensions/DeviceVibration/devicevibrationtools.js"],
      DialogueTree: [
        "Extensions/DialogueTree/dialoguetools.js",
        "Extensions/DialogueTree/bondage.js/dist/bondage.min.js",
      ],
      Effects: [
        "Extensions/Effects/pixi-filters/filter-adjustment.js",
        "Extensions/Effects/adjustment-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-kawase-blur.js",
        "Extensions/Effects/pixi-filters/filter-advanced-bloom.js",
        "Extensions/Effects/advanced-bloom-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-ascii.js",
        "Extensions/Effects/ascii-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-bevel.js",
        "Extensions/Effects/bevel-pixi-filter.js",
        "Extensions/Effects/black-and-white-pixi-filter.js",
        "Extensions/Effects/blending-mode-pixi-filter.js",
        "Extensions/Effects/blur-pixi-filter.js",
        "Extensions/Effects/brightness-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-bulge-pinch.js",
        "Extensions/Effects/bulge-pinch-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-crt.js",
        "Extensions/Effects/crt-pixi-filter.js",
        "Extensions/Effects/color-map-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-color-map.js",
        "Extensions/Effects/pixi-filters/filter-color-replace.js",
        "Extensions/Effects/color-replace-pixi-filter.js",
        "Extensions/Effects/displacement-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-dot.js",
        "Extensions/Effects/dot-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-drop-shadow.js",
        "Extensions/Effects/drop-shadow-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-glitch.js",
        "Extensions/Effects/glitch-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-glow.js",
        "Extensions/Effects/glow-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-godray.js",
        "Extensions/Effects/godray-pixi-filter.js",
        "Extensions/Effects/kawase-blur-pixi-filter.js",
        "Extensions/Effects/light-night-pixi-filter.js",
        "Extensions/Effects/night-pixi-filter.js",
        "Extensions/Effects/noise-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-old-film.js",
        "Extensions/Effects/old-film-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-outline.js",
        "Extensions/Effects/outline-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-pixelate.js",
        "Extensions/Effects/pixelate-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-rgb-split.js",
        "Extensions/Effects/rgb-split-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-radial-blur.js",
        "Extensions/Effects/radial-blur-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-reflection.js",
        "Extensions/Effects/reflection-pixi-filter.js",
        "Extensions/Effects/sepia-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-tilt-shift.js",
        "Extensions/Effects/tilt-shift-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-twist.js",
        "Extensions/Effects/twist-pixi-filter.js",
        "Extensions/Effects/pixi-filters/filter-zoom-blur.js",
        "Extensions/Effects/zoom-blur-pixi-filter.js",
      ],
      MyDummyExtension: [
        "Extensions/ExampleJsExtension/examplejsextensiontools.js",
        "Extensions/ExampleJsExtension/dummyeffect.js",
        "Extensions/ExampleJsExtension/dummyruntimeobject.js",
        "Extensions/ExampleJsExtension/dummyruntimeobject-pixi-renderer.js",
        "Extensions/ExampleJsExtension/dummyruntimebehavior.js",
        "Extensions/ExampleJsExtension/dummywithshareddataruntimebehavior.js",
      ],
      FacebookInstantGames: [
        "Extensions/FacebookInstantGames/facebookinstantgamestools.js",
      ],
      FileSystem: ["Extensions/FileSystem/filesystemtools.js"],
      Firebase: [
        "Extensions/Firebase/B_firebasejs/A_firebase-base.js",
        "Extensions/Firebase/B_firebasejs/B_firebase-performance.js",
        "Extensions/Firebase/C_firebasetools/C_firebasetools.js",
        "Extensions/Firebase/C_firebasetools/D_performancetools.js",
        "Extensions/Firebase/B_firebasejs/B_firebase-analytics.js",
        "Extensions/Firebase/C_firebasetools/D_analyticstools.js",
        "Extensions/Firebase/B_firebasejs/B_firebase-auth.js",
        "Extensions/Firebase/C_firebasetools/D_authtools.js",
        "Extensions/Firebase/B_firebasejs/B_firebase-functions.js",
        "Extensions/Firebase/C_firebasetools/D_functionstools.js",
        "Extensions/Firebase/B_firebasejs/B_firebase-database.js",
        "Extensions/Firebase/C_firebasetools/D_databasetools.js",
        "Extensions/Firebase/B_firebasejs/B_firebase-firestore.js",
        "Extensions/Firebase/C_firebasetools/D_cloudfirestoretools.js",
        "Extensions/Firebase/B_firebasejs/B_firebase-remote-config.js",
        "Extensions/Firebase/C_firebasetools/D_remoteconfigtools.js",
        "Extensions/Firebase/A_utils/A_UIDArray.js",
        "Extensions/Firebase/B_firebasejs/B_firebase-storage.js",
        "Extensions/Firebase/C_firebasetools/D_storagetools.js",
      ],
      Lighting: [
        "Extensions/Lighting/lightruntimeobject.js",
        "Extensions/Lighting/lightruntimeobject-pixi-renderer.js",
        "Extensions/Lighting/lightobstacleruntimebehavior.js",
      ],
      P2P: ["Extensions/P2P/A_peer.js", "Extensions/P2P/B_p2ptools.js"],
      Physics2: [
        "Extensions/Physics2Behavior/physics2tools.js",
        "Extensions/Physics2Behavior/physics2runtimebehavior.js",
        "Extensions/Physics2Behavior/box2d.js",
      ],
      Screenshot: ["Extensions/Screenshot/screenshottools.js"],
      SpatialSound: [
        "Extensions/SpatialSound/howler.spatial.min.js",
        "Extensions/SpatialSound/spatialsoundtools.js",
      ],
      TileMap: [
        "Extensions/TileMap/tilemapruntimeobject.js",
        "Extensions/TileMap/tilemapruntimeobject-pixi-renderer.js",
        "Extensions/TileMap/pixi-tilemap/dist/pixi-tilemap.umd.js",
        "Extensions/TileMap/pako/dist/pako.min.js",
        "Extensions/TileMap/pixi-tilemap-helper.js",
      ],
      Tween: [
        "Extensions/TweenBehavior/shifty.js",
        "Extensions/TweenBehavior/tweenruntimebehavior.js",
      ],
      Video: [
        "Extensions/Video/videoruntimeobject.js",
        "Extensions/Video/videoruntimeobject-pixi-renderer.js",
      ],
    };

    const CDN =
      "https://resources.gdevelop-app.com/GDJS-5.0.0-{{version}}/Runtime/";

    /**
     * A list of already loaded extension (to not reload already loaded extensions).
     */
    const loadedExtensions: Set<string> = new Set();

    /**
     * Loads a GDevelop extension.
     * @param extension - The extension to load.
     * @param [version] - The version of GDevelop of this extension. Default: `beta105`.
     */
    export const loadExtension = function (
      extension: keyof typeof EXTENSIONS,
      version: string = "beta105"
    ): Promise<void> {
      if (loadedExtensions.has(extension)) return Promise.resolve();
      if (EXTENSIONS[extension] === undefined)
        return Promise.reject("Extension not found!");

      loadedExtensions.add(extension);
      const allFiles = EXTENSIONS[extension].map(
        (link) =>
          new Promise<void>((resolve) => {
            const script = document.createElement("script");
            script.src = CDN.replace("{{version}}", version) + link;
            script.onload = function () {
              document.body.removeChild(script); // Cleanup document after loading file.
              resolve();
            };
            document.body.appendChild(script);
          })
      );

      return Promise.all(allFiles).then();
    };
  }
}
