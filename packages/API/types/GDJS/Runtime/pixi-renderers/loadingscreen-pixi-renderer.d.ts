declare namespace gdjs {
    class LoadingScreenPixiRenderer {
        _pixiRenderer: any;
        _loadingScreen: any;
        _progressText: any;
        _madeWithText: any;
        _websiteText: any;
        _splashImage: any;
        constructor(runtimeGamePixiRenderer: any, loadingScreenSetup: any);
        render(percent: any): void;
        unload(): void;
    }
    export const LoadingScreenRenderer: typeof LoadingScreenPixiRenderer;
    export {};
}
