## Installation

Install me by extracting that folder to a fixed location, opening chrome://extensions, activating Developer mode (top right), and clicking "Load unpacked Extension". Then just select the folder. 
For Firefox go on about:debugger then open unpacked extension and select that directory.

## Usage

When a page contains a GDevelop game, the extension will automatically patch it to gain access to the whole game. Then you can click on the top right the Extension's Icon.
If the current page has a patched GDevelop game, it will let you open a control pannel from which you can control the game.

## Internal Work

#### Injection

It works by Injecting a content script to every page and iframe using a content script. This script is sandboxed but has access to the chrome APIs (injector.js).
So we set up with the limited access we have a forwarding of window message events and forward it to the all the extension's scripts and pages.
Then we use our limited access to document to add a script element that loads a script (injected.js) that will be loaded by the page and not the extension 
and therefore has complete access to everything (unsandboxed).

#### Patching

We now detect if window.gdjs is present. If it is we assume this is a GDevelop game. In that case we define the global object `GDAPI` and scan for all children of that object 
having "Code" in its name and a child named func. Those are the eventLoops of every scene. 
We put the original to the child originalFunc and override func with the following:
```js
function(runtimeScene) {
    window.GDAPI.currentScene = runtimeScene;
    module.originalFunc(runtimeScene);
}
```
With that we gain access to the current scene at any time as every scene has now in it's event loop a step setting itself to the global `GDAPI.currentScene`.
With access to the current Scene, we control the whole game.

#### Scene Changing

We pass messages through the forwarding we have set up between the injected script and te extension to send messages between the UI and the injected script. 
The injected script will then do predefined actions to `GDAPI.currentScene` depending on the message sent by the UI.

