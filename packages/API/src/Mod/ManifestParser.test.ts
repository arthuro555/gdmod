import { parseModManifest } from "./ManifestParser";
import JSZip from "jszip";

// Disable console.warn as it is polluting the output.
console.warn = jest.fn();

describe("Mod manifest parser", () => {
  it("Throws on invalid mod files", () => {
    expect(parseModManifest).rejects.toThrow();

    expect(() => parseModManifest(new Uint8Array())).rejects.toThrow();
    expect(() => parseModManifest(null as any)).rejects.toThrow("e");

    expect(async () =>
      parseModManifest(
        await new JSZip()
          .file("test.txt", "YES")
          .generateAsync({ type: "uint8array" })
      )
    ).rejects.toThrow("A manifest file is missing! Is this a GDMod mod?");

    expect(async () =>
      parseModManifest(
        await new JSZip()
          .file("data/includes.json", `[]`)
          .file("data/resources.json", `[]`)
          .generateAsync({ type: "uint8array" })
      )
    ).rejects.toThrow("A manifest file is missing! Is this a GDMod mod?");
  });

  it("Validates mod data", () => {
    expect(async () =>
      parseModManifest(
        await new JSZip()
          .file("data/GDMod.json", `NOT VALID JSON`)
          .file("data/includes.json", `[]`)
          .file("data/resources.json", `[]`)
          .generateAsync({ type: "uint8array" })
      )
    ).rejects.toThrow(
      /A manifest could not be parsed\! Make sure it is valid JSON\./
    );

    expect(async () =>
      parseModManifest(
        await new JSZip()
          .file(
            "data/GDMod.json",
            `{"valid": "json", "but": ["invalid", "gdmod.json"]}`
          )
          .file("data/includes.json", `[]`)
          .file("data/resources.json", `[]`)
          .generateAsync({ type: "uint8array" })
      )
    ).rejects.toThrow(
      "The manifests are invalid! See the list of errors in the console."
    );

    expect(async () =>
      parseModManifest(
        await new JSZip()
          .file(
            "data/GDMod.json",
            `{
              "name": "FPS Counter",
              "description": "A simple FPS counter",
              "version": "0.0.2",
              "author": "Arthur Pacaud (arthuro555)",
              "uid": "gdmod/template/fps-counter"
            }`
          )
          .file("data/includes.json", `["hey.js"]`)
          .file("data/resources.json", `[]`)
          .generateAsync({ type: "uint8array" })
      )
    ).rejects.toThrow("Cannot find following include files: hey.js");

    expect(async () =>
      parseModManifest(
        await new JSZip()
          .file(
            "data/GDMod.json",
            `{
              "name": "FPS Counter",
              "description": "A simple FPS counter",
              "version": "0.0.2",
              "author": "Arthur Pacaud (arthuro555)",
              "uid": "gdmod/template/fps-counter"
            }`
          )
          .file("data/includes.json", `[]`)
          .file(
            "data/resources.json",
            `[{"file": "hey.png", "name": "hey.png", "kind": "image"}]`
          )
          .generateAsync({ type: "uint8array" })
      )
    ).rejects.toThrow("Cannot find following resource files: hey.png");
  });

  it("Parses a correct modfile", async () => {
    const modFile = await new JSZip()
      .file(
        "data/GDMod.json",
        `{
        "name": "FPS Counter",
        "description": "A simple FPS counter",
        "version": "0.0.2",
        "author": "Arthur Pacaud (arthuro555)",
        "uid": "gdmod/template/fps-counter"
      }`
      )
      .file("code/hey.js", "//code")
      .file("resources/hey.png", "//image")
      .file("data/includes.json", `["hey.js"]`)
      .file(
        "data/resources.json",
        `[{"file": "hey.png", "name": "hey.png", "kind": "image"}]`
      )
      .generateAsync({ type: "uint8array" });

    expect(parseModManifest(modFile)).resolves.toEqual({
      file: modFile,
      manifest: {
        mainManifest: {
          name: "FPS Counter",
          description: "A simple FPS counter",
          version: "0.0.2",
          author: "Arthur Pacaud (arthuro555)",
          uid: "gdmod/template/fps-counter",
        },
        includes: ["hey.js"],
        resources: [{ file: "hey.png", name: "hey.png", kind: "image" }],
      },
    });
  });

  it("Automatically fixes resources declarations", () => {
    expect(
      (async () =>
        (
          await parseModManifest(
            await new JSZip()
              .file(
                "data/GDMod.json",
                `{
              "name": "FPS Counter",
              "description": "A simple FPS counter",
              "version": "0.0.2",
              "author": "Arthur Pacaud (arthuro555)",
              "uid": "gdmod/template/fps-counter"
            }`
              )
              .file("data/includes.json", `[]`)
              .file("data/resources.json", `["hey.png"]`)
              .file("resources/hey.png", "//image")
              .generateAsync({ type: "uint8array" })
          )
        ).manifest.resources[0])()
    ).resolves.toEqual({ file: "hey.png", name: "hey.png", kind: "image" });

    expect(
      (async () =>
        (
          await parseModManifest(
            await new JSZip()
              .file(
                "data/GDMod.json",
                `{
              "name": "FPS Counter",
              "description": "A simple FPS counter",
              "version": "0.0.2",
              "author": "Arthur Pacaud (arthuro555)",
              "uid": "gdmod/template/fps-counter"
            }`
              )
              .file("data/includes.json", `[]`)
              .file("data/resources.json", `[{"file": "hey.png"}]`)
              .file("resources/hey.png", "//image")
              .generateAsync({ type: "uint8array" })
          )
        ).manifest.resources[0])()
    ).resolves.toEqual({ file: "hey.png", name: "hey.png", kind: "image" });

    expect(
      (async () =>
        (
          await parseModManifest(
            await new JSZip()
              .file(
                "data/GDMod.json",
                `{
              "name": "FPS Counter",
              "description": "A simple FPS counter",
              "version": "0.0.2",
              "author": "Arthur Pacaud (arthuro555)",
              "uid": "gdmod/template/fps-counter"
            }`
              )
              .file("data/includes.json", `[]`)
              .file(
                "data/resources.json",
                `[{"name": "hey.png", "file": "hey.png"}]`
              )
              .file("resources/hey.png", "//image")
              .generateAsync({ type: "uint8array" })
          )
        ).manifest.resources[0])()
    ).resolves.toEqual({ file: "hey.png", name: "hey.png", kind: "image" });
  });
});
