import { JSZipObject } from "jszip";
import type { Loader } from ".";
import { game } from "../Utilities/GDJSAccess";

/**
 * Loads a mod audio file into GDevelops audio manager.
 * @param file - The mod file {@link JSZip} instance.
 * @param resource - The GDevelop resource data of the file to load.
 */
const AudioLoader: Loader = async (file, resource) => {
  const audioFile = ((await file.file(
    "resources/" + resource.file
  )) as JSZipObject).async("blob");
  const audioManager = game.getSoundManager();

  // Override the resource with the new URL
  audioManager._availableResources[resource.name] = Object.assign(
    { metadata: "", userAdded: false },
    resource,
    {
      file: URL.createObjectURL(audioFile),
    }
  );

  // Preload the newly added audio file if possible
  if (audioManager.hasOwnProperty("loadAudio")) {
    audioManager.loadAudio(resource.name, false);
    audioManager.loadAudio(resource.name, true);
  }
};

export default AudioLoader;
