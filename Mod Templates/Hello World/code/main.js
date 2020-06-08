// This is the main code file. It declares the Mods namespace, the mod, etc.

/**
 * My mods shared data
 * @namespace
 */
window.MyAwesomeMod = {};

/**
 * My Hello World Mod :)
 * @extends {GDAPI.Mod}
 */
class HelloWorldMod extends GDAPI.Mod {
    initialize() {
        MyAwesomeMod.message = "Hello World!";
    },
    preEvent(runtimeScene) {
        console.log(MyAwesomeMod.message);
    }
}

MyAwesomeMod.HelloWorldMod = HelloWorldMod;

GDAPI.loadMod(new MyAwesomeMod.HelloWorldMod());
