import type { Loader } from ".";
import { game } from "../Utilities/GDJSAccess";
import type tPIXI from "pixi.js";
declare const PIXI: typeof tPIXI;

/**
 * Loads a mod image file into GDevelops image manager.
 * @param file - The mod file {@link JSZip} instance.
 * @param resource - The GDevelop resource data of the file to load.
 */
const ImageLoader: Loader = async function (file, resource) {
  const resourceFile = await file
    .file("resources/" + resource.file)!
    .async("blob");
  // Get an URL for the image Blob
  const blobURL = URL.createObjectURL(resourceFile);

  // Load the image as a pixi texture
  game
    .getImageManager()
    ._loadedTextures.put(resource.name, await PIXI.Texture.fromURL(blobURL));

  URL.revokeObjectURL(blobURL);
};

export default ImageLoader;
