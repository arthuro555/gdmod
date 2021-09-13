import * as _GDAPI from "./module.entry";

declare global {
  var GDAPI: typeof _GDAPI;
}

window.GDAPI = _GDAPI;
