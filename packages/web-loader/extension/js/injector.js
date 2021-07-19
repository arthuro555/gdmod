(function () {
  // We need direct access to gdjs.
  // To do so we need to escape the sandbox by injecting a script tag into the document
  // to load a script we control as a normal script.
  const injectScript = (scriptURL, onLoad = () => {}) => {
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", chrome.extension.getURL(scriptURL));
    script.onload = () => {
      // Remove the script on load to keep the DOM clean
      script.remove();
      onLoad(script);
    };
    document.body.appendChild(script);
  };

  injectScript("/js/injected.js");
  injectScript("/vendor/localforage.min.js", () =>
    window.postMessage({ message: "localforageReady" }, "*")
  );

  // We injected the script but we also need to pass messages
  // from the injected script to the popup and back, and the
  // sandbox bypass prevents the usage of chrome extensions APIs.
  // Therefore, we setup a bridge using postMessage.
  window.addEventListener("message", (event) => {
    if (
      typeof event.data["forwardTo"] !== "undefined" &&
      event.data["forwardTo"] === "GDMod" &&
      typeof event.data["payload"] !== "undefined"
    ) {
      if (event.data.payload.id === "installAPI") {
        injectScript("/api/polyfill.js");
        injectScript("/api/GDApi.js");
      } else chrome.runtime.sendMessage(event.data.payload);
    }
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    window.postMessage(request, "*");
  });
})();
