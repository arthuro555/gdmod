# Web Loader

This browser extension permits to load mods on web games

## Installation

Installation instructions for users [on the wiki](https://github.com/arthuro555/gdmod/wiki/Installation-Guide#install-it).

In development mode, you need to install the current directory as an unpacked extension. To use your local API files, you will need to run `npm run dev` at the root of the repository to host the API files, and in `js/injected.js`, make the variable `debug = true` to load from localhost instead of the CDN.

## Usage

When a page contains a GDevelop game, the extension will automatically patch it to gain access to the whole game. Then you can click on the top right the Extension's Icon.
If the current page has a patched GDevelop game, it will let you open a control pannel from which you can control the game.

## Internal Work

#### Injection

It works by Injecting a content script to every page and iframe. This script is sandboxed but has access to the chrome APIs (injector.js).
So we set up with the limited access we have a forwarding of window message events and forward it to the all the extension's scripts and pages.
Then we use our limited access to document to add a script element that loads a script (injected.js) that will be loaded by the page and not the extension, and therefore has complete access to everything (it runs unsandboxed).

#### Patching

We now verify if `window.gdjs` is present. If it is we assume this is a GDevelop game. In that case we define the global object `GDAPI` and scan for all children of `gdjs` object 
having "Code" in its name and a child named `func`. Those are the event sheets of every scene. 
We rename the original `func` to `originalFunc` and override func with the following:
```js
function(runtimeScene) {
    window.GDAPI.game = runtimeScene.getGame();
    originalFunc(runtimeScene);
}
```
With that we gain access to the whole game permanently, and with that the control of every scene too.
