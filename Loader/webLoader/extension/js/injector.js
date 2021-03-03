(function () {
  // We need direct access to gdjs.
  // To do so we need to escape the sandbox by injecting a script tag into the document
  // to load a script we control as a normal script.

  // First we create a script
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  // We set the script to an extension file
  script.setAttribute("src", chrome.extension.getURL("/js/injected.js"));
  // Remove it on load to keep the DOM clean
  script.onload = () => script.remove();
  // And now inject it into the body
  document.body.appendChild(script);

  // LocalForage is injected after as the gdjs patch has to happen asap.
  const localforageScript = document.createElement("script");
  localforageScript.setAttribute("type", "text/javascript");
  localforageScript.setAttribute(
    "src",
    chrome.extension.getURL("/vendor/localforage.min.js")
  );
  localforageScript.onload = () => {
    localforageScript.remove();
    window.postMessage({ message: "localforageReady" }, "*");
  };
  document.body.appendChild(localforageScript);

  // We injected the script but we also need to pass messages from the Injected script to the extension and back
  window.addEventListener("message", (event) => {
    if (
      typeof event.data["forwardTo"] !== "undefined" &&
      event.data["forwardTo"] === "GDMod"
    ) {
      if (typeof event.data["payload"] !== "undefined") {
        chrome.runtime.sendMessage(event.data.payload);
      } else if (event.data.listIncludes) {
        fetch(chrome.runtime.getURL("/api/includes.json"))
          .then((res) => res.json())
          .then((includes) =>
            includes.map((item) => chrome.runtime.getURL("/api/" + item))
          )
          .then((includes) =>
            window.postMessage({ message: "includesList", includes }, "*")
          );
      }
    }
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    window.postMessage(request, "*");
  });
})();
