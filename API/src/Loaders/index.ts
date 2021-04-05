import type JSZip from "jszip";
import type { Resource } from "../Mod/ManifestParser";
import ImageLoader from "./ImageLoader";

export type Loader = (file: JSZip, resource: Resource) => Promise<void>;
const MockLoader: Loader = () => Promise.resolve();
const loaders: Record<ResourceKind, Loader> = {
  image: ImageLoader,
  audio: MockLoader,
  font: MockLoader,
  video: MockLoader,
  json: MockLoader,
};

export const loadResources = (file: JSZip, resources: Resource[]) =>
  Promise.all(
    resources.map((resource) => loaders[resource.kind](file, resource))
  );
