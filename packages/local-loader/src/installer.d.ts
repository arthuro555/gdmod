declare module "@gdmod/local-loader" {
  export const installGDMod: (outputDir: string) => Promise<void>;
  export const installGDModElectron: (outputDir: string) => Promise<void>;
}
