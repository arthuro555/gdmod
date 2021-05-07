import { Mod } from "@gdmod/api";

export default class MyMod extends Mod {
  preEvent() {
    console.log("My mod is working!");
  }
}
