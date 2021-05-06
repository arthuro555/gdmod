import { loadAsync as loadZIP } from "jszip";
import * as t from "typanion";

type File = Blob | Buffer | ArrayBuffer | Uint8Array;

const isFile: () => t.StrictValidator<unknown, File> = () =>
  t.makeValidator({
    test: (value, state): value is File => {
      if (
        (typeof Blob !== "undefined" && value instanceof Blob) ||
        (typeof Buffer !== "undefined" && value instanceof Buffer) ||
        (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) ||
        (typeof Uint8Array !== "undefined" && value instanceof Uint8Array)
      )
        return true;
      else
        return t.pushError(
          state,
          `Expected a file (got ${t.getPrintable(value)})`
        );
    },
  });

const isResource = t.isObject({
  name: t.isString(),
  file: t.isString(),
  kind: t.isOneOf(
    [
      t.isLiteral("image"),
      t.isLiteral("audio"),
      t.isLiteral("font"),
      t.isLiteral("video"),
      t.isLiteral("json"),
    ],
    { exclusive: true }
  ),
});

const isManifests = t.isObject({
  mainManifest: t.isObject({
    name: t.isString(),
    description: t.isString(),
    version: t.isString(),
    author: t.isString(),
    uid: t.isString(),
  }),
  includes: t.isArray(t.isString()),
  resources: t.isArray(isResource),
});

const isModFile = t.isObject({
  manifest: isManifests,
  file: isFile(),
});

export type Resource = t.InferType<typeof isResource>;
export type ModFile = t.InferType<typeof isModFile>;

/**
 * Parses a mod from a zip.
 * This allows preparsing the mod when installing it, to have access to its metadata without initializing it.
 * This also validates all the manifests.
 *
 * @param rawFile - The Mod file.
 * @internal
 */
export const parseModManifest = async function (
  rawFile: File
): Promise<ModFile> {
  // Load the zip
  const file = await loadZIP(rawFile);

  // Load the files
  const mainManifestFile = file.file("data/GDMod.json");
  const includesFile = file.file("data/includes.json");
  const resourcesFile = file.file("data/resources.json");

  // Verify their presence
  if (
    mainManifestFile == undefined ||
    includesFile == undefined ||
    resourcesFile == undefined
  )
    throw new Error("A manifest file is missing! Is this a GDMod mod?");

  // Parse the files into a ModFile object
  try {
    var modFile: ModFile = {
      manifest: {
        mainManifest: JSON.parse(await mainManifestFile.async("string")),
        includes: JSON.parse(await includesFile.async("string")),
        resources: JSON.parse(await resourcesFile.async("string")),
      },
      file: rawFile,
    };
  } catch (e) {
    throw new Error(
      "A manifest could not be parsed! Make sure it is valid JSON. " + e
    );
  }

  // Try to autofix any invalid resource.
  modFile.manifest.resources = modFile.manifest.resources.map((resource) => {
    // If a string is supplied, use it as file and resource name for an image.
    if (typeof resource === "string")
      return { name: resource, file: resource, kind: "image" };

    // Default kind is image.
    if (!("kind" in resource)) (resource as any).kind = "image";

    // Default resource name is file name.
    if (!("name" in resource)) (resource as any).name = (resource as any).file;

    return resource;
  });

  // Verify if the ModFile matches the schema
  const errors: string[] = [];
  if (!isModFile(modFile, { errors })) {
    console.warn(
      "Some errors have been detected while parsing manifests: ",
      errors
    );
    throw new Error(
      "The manifests are invalid! See the list of errors in the console."
    );
  }

  // Verify the presence of files for the resources and includes
  const invalidIncludes = modFile.manifest.includes.filter(
    (include) => file.file("code/" + include) === null
  );
  if (invalidIncludes.length !== 0)
    throw new Error(
      "Cannot find following include files: " + invalidIncludes.join(", ")
    );

  const invalidResources = modFile.manifest.resources.filter(
    (resource) => file.file("resources/" + resource.file) === null
  );
  if (invalidResources.length !== 0)
    throw new Error(
      "Cannot find following resource files: " +
        invalidResources.map((r) => r.file).join(", ")
    );

  return modFile;
};
