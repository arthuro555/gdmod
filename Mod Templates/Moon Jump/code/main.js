/**
 * The moon jump mod.
 * Allows to fly.
 * @extends {GDAPI.Mod}
 */
class MoonJumpMod extends GDAPI.Mod {
  preEvent(runtimeScene) {
    runtimeScene._constructListOfAllInstances();
    for (let gdobject of runtimeScene._allInstancesList) {
      for (let behavior of gdobject._behaviors) {
        if (behavior.type === "PlatformBehavior::PlatformerObjectBehavior")
          behavior._canJump = true;
      }
    }
  }
}

return MoonJumpMod;
