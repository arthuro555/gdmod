import type { Loader } from ".";

const ImageLoader: Loader = async function (file, resource) {
  //@ts-ignore parseModManifest already made sure that it isn't null
  const resourceFile = await file
    .file("resources/" + resource.file)
    .async("blob");
  // Get an URL for the image Blob
  const blobURL = URL.createObjectURL(resourceFile);

  // Load the image as a pixi texture
  GDAPI.game
    .getImageManager()
    ._loadedTextures.put(
      resource.name, 
      //@ts-expect-error GDevelop has some hacky stuff going on with PIXI, disable typechecking for it.
      await PIXI.Texture.fromURL(blobURL)
    );

  URL.revokeObjectURL(blobURL);
};

export default ImageLoader;
