const FPSObjectData = {
  // General Object Data
  name: "FPSModTextObject",
  type: "TextObject::Text",
  variables: [],
  behaviors: [],
  // Text Object Data
  characterSize: 70,
  font: "Arial",
  bold: false,
  italic: false,
  underlined: false,
  color: {
    r: 20,
    g: 200,
    b: 20,
  },
  string: "FPS: ",
};

/**
 * An FPS Counter.
 * @extends {GDAPI.Mod}
 */
class FpsCounterMod extends GDAPI.Mod {
  /** @type {gdjs.TextRuntimeObject | null} */
  fpsText = null;

  constructor() {
    super();
    GDAPI.extTools
      .loadExtension("TextObject")
      .then(() => this.sceneChanged(GDAPI.currentScene));
  }

  unload() {
    if (this.fpsText) this.fpsText.deleteFromScene();
  }

  sceneChanged(runtimeScene) {
    // Inject Layer
    runtimeScene._layers.put(
      "FPSCounterModLayer",
      new gdjs.Layer(
        {
          name: "FPSCounterModLayer",
          visibility: true,
          effects: [],
        },
        runtimeScene
      )
    );
    // Inject object
    runtimeScene.registerObject(FPSObjectData);
    this.fpsText = runtimeScene.createObject("FPSModTextObject");
    this.fpsText.setLayer("FPSCounterModLayer");
  }

  postEvent(runtimeScene) {
    if (this.fpsText)
      this.fpsText.setString(
        "FPS: " +
          Math.round(
            1 / gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene)
          )
      );
  }
}

return FpsCounterMod;
