import { loadExtension } from "./ExtensionsLoader";

describe("GDevelop extension loader", () => {
  //@ts-ignore This is an incomplete mock
  global.gdjs = {
    //@ts-ignore This is an incomplete mock
    RuntimeObject: class RuntimeObject {},
    registerObject: () => null,
  };

  it("Loads an extension", async () => {
    expect(gdjs).not.toHaveProperty("TextRuntimeObject");
    expect(gdjs).not.toHaveProperty("TextRuntimeObjectRenderer");
    await expect(loadExtension("TextObject")).resolves.toBeUndefined();
    expect(gdjs).toHaveProperty("TextRuntimeObject");
    expect(gdjs).toHaveProperty("TextRuntimeObjectRenderer");
  });

  it("Doesn't reload an extension", async () => {
    //@ts-ignore
    delete gdjs.TextRuntimeObject;
    //@ts-ignore
    delete gdjs.TextRuntimeObjectRenderer;

    expect(gdjs).not.toHaveProperty("TextRuntimeObject");
    expect(gdjs).not.toHaveProperty("TextRuntimeObjectRenderer");
    await expect(loadExtension("TextObject")).resolves.toBeUndefined();
    expect(gdjs).not.toHaveProperty("TextRuntimeObject");
    expect(gdjs).not.toHaveProperty("TextRuntimeObjectRenderer");
  });
});
