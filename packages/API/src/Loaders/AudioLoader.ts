import { JSZipObject } from "jszip";
import type { Loader } from ".";
import { game } from "../Utilities/GDJSAccess";

/**
 * Loads a mod audio file into GDevelops audio manager.
 * @param file - The mod file {@link JSZip} instance.
 * @param resource - The GDevelop resource data of the file to load.
 */
const AudioLoader: Loader = async (file, resource) => {
  // DataURIs isn't ideal but blob urls aren't supported by howler.
  const audioFile = await (
    file.file("resources/" + resource.file) as JSZipObject
  ).async("base64");
  const audioManager = game.getSoundManager();

  // Override the resource with the new URL
  audioManager._availableResources[resource.name] = Object.assign(
    { metadata: "", userAdded: false },
    resource,
    {
      // Note that using the extension name is not standard compliant,
      // but Howler requires this being the file extension not a real MIME type.
      file: `data:audio/${resource.file.split(".").pop()};base64,${audioFile}`,
    }
  );

  // Preload the newly added audio file if possible
  if (audioManager.hasOwnProperty("loadAudio")) {
    audioManager.loadAudio(resource.name, false);
    audioManager.loadAudio(resource.name, true);
  }
};

export default AudioLoader;
