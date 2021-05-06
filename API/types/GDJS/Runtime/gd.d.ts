/**
 * The `gdjs` namespace contains all classes and objects of the game engine.
 * @namespace gdjs
 */
declare namespace gdjs {
    /**
     * Contains functions used by events (this is a convention only, functions can actually
     * be anywhere).
     * @namespace
     * @memberOf gdjs
     */
    export namespace evtTools {
    }
    export const objectsTypes: Hashtable<typeof RuntimeObject>;
    export const behaviorsTypes: Hashtable<typeof RuntimeBehavior>;
    type RuntimeSceneCallback = (runtimeScene: gdjs.RuntimeScene) => void;
    type RuntimeSceneRuntimeObjectCallback = (runtimeScene: gdjs.RuntimeScene, runtimeObject: gdjs.RuntimeObject) => void;
    export const callbacksFirstRuntimeSceneLoaded: Array<RuntimeSceneCallback>;
    export const callbacksRuntimeSceneLoaded: Array<RuntimeSceneCallback>;
    export const callbacksRuntimeScenePreEvents: Array<RuntimeSceneCallback>;
    export const callbacksRuntimeScenePostEvents: Array<RuntimeSceneCallback>;
    export const callbacksRuntimeScenePaused: Array<RuntimeSceneCallback>;
    export const callbacksRuntimeSceneResumed: Array<RuntimeSceneCallback>;
    export const callbacksRuntimeSceneUnloading: Array<RuntimeSceneCallback>;
    export const callbacksRuntimeSceneUnloaded: Array<RuntimeSceneCallback>;
    export const callbacksObjectDeletedFromScene: Array<RuntimeSceneRuntimeObjectCallback>;
    /**
     * Convert a rgb color value to a hex string.
     *
     * No "#" or "0x" are added.
     * @param r Red
     * @param g Green
     * @param b Blue
     */
    export const rgbToHex: (r: integer, g: integer, b: integer) => string;
    /**
     * Convert a rgb color value to a hex value.
     * @param r Red
     * @param g Green
     * @param b Blue
     */
    export const rgbToHexNumber: (r: integer, g: integer, b: integer) => integer;
    /**
     * Convert a hex color value to an rgb object.
     * @param hex Hex color
     */
    export const hexNumberToRGB: (hexNumber: number) => {
        r: integer;
        g: integer;
        b: integer;
        a: integer;
    };
    /**
     * Get a random integer between 0 and max.
     * @param max The maximum value (inclusive).
     */
    export const random: (max: float) => float;
    /**
   * Get a random integer between min and max.
   * @param min The minimum value (inclusive).
   * @param max The maximum value (inclusive).
  
   */
    export const randomInRange: (min: float, max: float) => float;
    /**
     * Get a random float in the range 0 to less than max (inclusive of 0, but not max).
     * @param max The maximum value (exclusive).
     */
    export const randomFloat: (max: float) => float;
    /**
     * Get a random float between min and max
     * @param min The minimum value (inclusive).
     * @param max The maximum value (exclusive).
     * @returns {number}
     */
    export const randomFloatInRange: (min: float, max: float) => float;
    /**
     * Get a random number between min and max in steps
     * @param min The minimum value (inclusive).
     * @param max The maximum value (inclusive).
     * @param step The interval between each value.
     * @returns {number}
     */
    export const randomWithStep: (min: float, max: float, step: float) => float;
    /**
     * Convert an angle in degrees to radians.
     * @param angleInDegrees The angle in degrees.
     */
    export const toRad: (angleInDegrees: float) => float;
    /**
     * Convert an angle in radians to degrees.
     * @param angleInRadians The angle in radians.
     */
    export const toDegrees: (angleInRadians: float) => float;
    /**
     * Register a runtime object (class extending {@link gdjs.RuntimeObject}) that can be used in a scene.
     *
     * The name of the type of the object must be complete, with the namespace if any. For
     * example, if you are providing a Text object in the TextObject extension, the full name
     * of the type of the object is "TextObject::Text".
     *
     * @param objectTypeName The name of the type of the Object.
     * @param Ctor The constructor of the Object.
     */
    export const registerObject: (objectTypeName: string, Ctor: typeof gdjs.RuntimeObject) => void;
    /**
     * Register a runtime behavior (class extending {@link gdjs.RuntimeBehavior}) that can be used by a
     * {@link gdjs.RuntimeObject}.
     *
     * The type of the behavior must be complete, with the namespace of the extension. For
     * example, if you are providing a Draggable behavior in the DraggableBehavior extension,
     * the full name of the type of the behavior is "DraggableBehavior::Draggable".
     *
     * @param behaviorTypeName The name of the type of the behavior.
     * @param Ctor The constructor of the Object.
     */
    export const registerBehavior: (behaviorTypeName: string, Ctor: typeof gdjs.RuntimeBehavior) => void;
    /**
     * Register a function to be called when the first {@link gdjs.RuntimeScene} is loaded, after
     * resources loading is done. This can be considered as the "start of the game".
     *
     * @param callback The function to be called.
     */
    export const registerFirstRuntimeSceneLoadedCallback: (callback: RuntimeSceneCallback) => void;
    /**
     * Register a function to be called when a scene is loaded.
     * @param callback The function to be called.
     */
    export const registerRuntimeSceneLoadedCallback: (callback: RuntimeSceneCallback) => void;
    /**
     * Register a function to be called each time a scene is stepped (i.e: at every frame),
     * before events are run.
     * @param callback The function to be called.
     */
    export const registerRuntimeScenePreEventsCallback: (callback: RuntimeSceneCallback) => void;
    /**
     * Register a function to be called each time a scene is stepped (i.e: at every frame),
     * after events are run and before rendering.
     * @param callback The function to be called.
     */
    export const registerRuntimeScenePostEventsCallback: (callback: RuntimeSceneCallback) => void;
    /**
     * Register a function to be called when a scene is paused.
     * @param callback The function to be called.
     */
    export const registerRuntimeScenePausedCallback: (callback: RuntimeSceneCallback) => void;
    /**
     * Register a function to be called when a scene is resumed.
     * @param callback The function to be called.
     */
    export const registerRuntimeSceneResumedCallback: (callback: RuntimeSceneCallback) => void;
    /**
     * Register a function to be called when a scene unload started. This is
     * before the object deletion and renderer destruction. It is safe to
     * manipulate these. It is **not** be safe to release resources as other
     * callbacks might do operations on objects or the scene.
     *
     * @param callback The function to be called.
     */
    export const registerRuntimeSceneUnloadingCallback: (callback: RuntimeSceneCallback) => void;
    /**
     * Register a function to be called when a scene is unloaded. The objects
     * and renderer are now destroyed - it is **not** safe to do anything apart
     * from releasing resources.
     *
     * @param callback The function to be called.
     */
    export const registerRuntimeSceneUnloadedCallback: (callback: RuntimeSceneCallback) => void;
    /**
     * Register a function to be called when an object is deleted from a scene.
     * @param callback The function to be called.
     */
    export const registerObjectDeletedFromSceneCallback: (callback: RuntimeSceneRuntimeObjectCallback) => void;
    /**
     * Keep this function until we're sure now client is using it anymore.
     * @deprecated
     * @private
     */
    export const registerGlobalCallbacks: () => void;
    /**
     * Remove all the global callbacks that were registered previously.
     *
     * Should only be used for testing - this should never be used at runtime.
     */
    export const clearGlobalCallbacks: () => void;
    /**
     * Get the constructor of an object.
     *
     * @param name The name of the type of the object.
     */
    export const getObjectConstructor: (name: string) => typeof gdjs.RuntimeObject;
    /**
     * Get the constructor of a behavior.
     *
     * @param name The name of the type of the behavior.
     */
    export const getBehaviorConstructor: (name: string) => typeof gdjs.RuntimeBehavior;
    /**
     * Create a static array that won't need a new allocation each time it's used.
     * @param owner The owner of the Array.
     */
    export const staticArray: (owner: any) => Array<any>;
    /**
     * Create a second static array that won't need a new allocation each time it's used.
     * @param owner The owner of the Array.
     */
    export const staticArray2: (owner: any) => Array<any>;
    /**
     * Create a static object that won't need a new allocation each time it's used.
     * @param owner The owner of the Array.
     */
    export const staticObject: (owner: any) => Object;
    /**
     * Return a new array of objects that is the concatenation of all the objects passed
     * as parameters.
     * @param objectsLists
     * @returns {Array}
     */
    export const objectsListsToArray: (objectsLists: Hashtable<RuntimeObject>) => Array<RuntimeObject>;
    /**
     * Copy the element for the first array into the second array, so that
     * both array contains the same elements.
     * @param src The source array
     * @param dst The destination array
     */
    export const copyArray: <T>(src: T[], dst: T[]) => void;
    interface MakeUUID {
        (): string;
        hex?: string[];
    }
    /**
     * Generate a UUID v4.
     * @returns The generated UUID.
     */
    export const makeUuid: MakeUUID;
    export {};
}
