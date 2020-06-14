const FPSObjectData = {
    // General Object Data
    name: "FPSModTextObject",
    type: "TextObject::Text",
    variables: [],
    behaviors: [],
    // Text Onject Data
    characterSize: 70,
    font: "Arial",
    bold: false,
    italic: false,
    underlined: false,
    color: {
        r: 20,
        g: 200,
        b: 20
    },
    string: "FPS: "
};

let currentFPSTextObject;

function injectTextObject(runtimeScene) {
    // Inject Layer
    runtimeScene._layers.put(
        "FPSCounterModLayer", 
        new gdjs.Layer({
            name: "FPSCounterModLayer",
            visibility: true
        }, runtimeScene)
    );
    runtimeScene.registerObject(FPSObjectData);
    currentFPSTextObject = runtimeScene.createObject("FPSModTextObject");
    currentFPSTextObject.setLayer("FPSCounterModLayer");
}

/**
 * An FPS Counter.
 * @extends {GDAPI.Mod}
 */
class FpsCounterMod extends GDAPI.Mod {
    initialize() {
        injectTextObject(GDAPI.currentScene);
    };
    postEvent(runtimeScene) {
        currentFPSTextObject.setString("FPS: " + Math.round(1/gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene)))
    };
}

GDAPI.registerCallback(GDAPI.CALLBACKS.SCENE_LOADED, (runtimeScene) => {
    injectTextObject(runtimeScene);
});

return FpsCounterMod;
