import type JSZip from "jszip";
import type { Resource } from "../Mod/ManifestParser";
import ImageLoader from "./ImageLoader";
import AudioLoader from "./AudioLoader";

export type Loader = (file: JSZip, resource: Resource) => Promise<void>;
const MockLoader: Loader = () => Promise.resolve();
const loaders: Record<ResourceKind, Loader> = {
  image: ImageLoader,
  audio: AudioLoader,
  font: MockLoader,
  video: MockLoader,
  json: MockLoader,
};

/**
 * Load a list of GDevelop resources while automatically
 * chosing the correct loader using the resource kind attribute.
 *
 * @param file - The mod file {@link JSZip} instance.
 * @param resources - An array of GDevelop resources.
 * @returns A promise that resolves once everything has loaded
 */
export const loadResources = (
  file: JSZip,
  resources: Resource[]
): Promise<void> =>
  Promise.all(
    resources.map((resource) => loaders[resource.kind](file, resource))
  ).then(() => undefined);
