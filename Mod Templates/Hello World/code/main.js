// This is the main code file. It declares the Mods namespace, the mod, etc.
// It returns the new Mod created.

/**
 * My mods shared data
 * @namespace
 */
window.MyAwesomeMod = {
    other: "Hello from the other side ;)"
};

/**
 * My Hello World Mod :)
 * @extends {GDAPI.Mod}
 */
class HelloWorldMod extends GDAPI.Mod {
    message = "Hello World!";

    preEvent() {
        console.log(this.message);
    };
}

return HelloWorldMod;
