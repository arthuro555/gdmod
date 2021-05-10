import { Mod, game } from "@gdmod/api";

export default class MyMod extends Mod {
  i = 0;
  preEvent() {
    if (this.i++ % 200 === 0)
      game.getSoundManager().playSound("ding.wav", false, 100, 1);
  }
}
