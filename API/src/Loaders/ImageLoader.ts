import type { Loader } from ".";

const ImageLoader: Loader = async function (file, resource) {
  // Get an URL for the image Blob
  //@ts-ignore parseModManifest We trust the user for giving a correct path
  const resourceFile = await file
    .file("resources/" + resource.file)
    .async("blob");
  const blobURL = URL.createObjectURL(resourceFile);

  // Create an HTML image element
  const img = new Image();
  img.src = blobURL;

  // Wait for the image to load
  await new Promise<void>((resolve) => {
    img.addEventListener("load", () => resolve());
  });

  // Load the image as a pixi texture
  GDAPI.game
    .getImageManager()
    ._loadedTextures.put(
      resource.name,
      new PIXI.Texture(new PIXI.BaseTexture(img))
    );

  // Revoke the URL as we are done with loading the image
  URL.revokeObjectURL(blobURL);
};

export default ImageLoader;
