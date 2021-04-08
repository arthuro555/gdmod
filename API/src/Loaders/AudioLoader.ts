import type { Loader } from ".";

const AudioLoader: Loader = async (file, resource) => {
  //@ts-ignore parseModManifest already made sure that it isn't null
  const audioFile = await file.file("resources/" + resource.file).async("blob");
  const audioManager = GDAPI.game.getSoundManager();

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
