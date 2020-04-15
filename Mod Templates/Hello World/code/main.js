// This is the main code file. It declares the Mods namespace, the mod, etc.

/**
 * My mods shared data
 * @namespace
 */
MyAwesomeMod = {};

/**
 * My Hello World Mod :)
 * @extends {GDAPI.Mod}
 */
class MyAwesomeMod.HelloWorldMod extends GDAPI.Mod {
    initialize() {
        MyAwesomeMod.message = "Hello World!";
    },
    preEvent(runtimeScene) {
        console.log(MyAwesomeMod.message);
    }
}

GDAPI.loadMod(new MyAwesomeMod.HelloWorldMod());
