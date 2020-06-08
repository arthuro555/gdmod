// We need direct access to gdjs. 
// To do so we need to escape the sandbox by injecting a script tag into the document
// to load a script we control as a normal script.

// First we create a script
var script = document.createElement("script");
script.setAttribute('type', 'text/javascript');

// We set the script to an extension file
script.setAttribute("src", chrome.extension.getURL("/js/injected.js"));

// Mark it as the GDmod patcher script for removing it later
script.setAttribute("id", "gdmod-patcher-script");

// And now inject it into the body
document.body.appendChild(script);

// We injected the script but we also need to pass messages from the Injected script to the extension and back
window.addEventListener("message", (event) => {
    if(typeof event.data["forwardTo"] !== "undefined" && event.data["forwardTo"] === "GDMod") {
        if(typeof event.data["payload"] !== "undefined") {
            chrome.runtime.sendMessage(event.data.payload);
        }
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    window.postMessage(request, "*")
});
