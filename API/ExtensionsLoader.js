/**
 * Tools to load GDevelop Extensions.
 * @memberof GDAPI
 * @namespace
 */
GDAPI.extTools = {};

/**
 * Contains the extension includes.
 * This is auto-generated.
 * See https://github.com/arthuro555/GDevelop/tree/gdmod-generate-includes-list.
 */
GDAPI.extTools.EXTENSIONS = {
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
  AdvancedWindow: ["Extensions/AdvancedWindow/electron-advancedwindowtools.js"],
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
  Tween: [
    "Extensions/TweenBehavior/shifty.js",
    "Extensions/TweenBehavior/tweenruntimebehavior.js",
  ],
  Video: [
    "Extensions/Video/videoruntimeobject.js",
    "Extensions/Video/videoruntimeobject-pixi-renderer.js",
  ],
};

GDAPI.extTools.CDN =
  "https://resources.gdevelop-app.com/GDJS-5.0.0-beta100/Runtime/";

/**
 * A list of already loaded extension (to not reload already loaded extensions).
 */
GDAPI.extTools.loadedExtensions = [];

/**
 * Loads a GDevelop extension.
 * @param {GDAPI.extTools.EXTENSIONS} extension - The extension to load.
 * @returns {Promise}
 */
GDAPI.extTools.loadExtension = function (extension) {
  if (this.loadedExtensions.indexOf(extension) !== -1) return Promise.resolve();
  if (this.EXTENSIONS[extension] === undefined)
    return Promise.reject("Extension not found!");

  GDAPI.extTools.loadedExtensions.push(extension);
  const allFiles = this.EXTENSIONS[extension].map(
    (link) =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = this.CDN + link;
        script.onload = function () {
          document.body.removeChild(script); // Cleanup document after loading file.
          resolve();
        };
        document.body.appendChild(script);
      })
  );
  return Promise.all(allFiles);
};
