declare namespace gdjs {
    namespace evtTools {
        namespace runtimeScene {
            const sceneJustBegins: (runtimeScene: any) => any;
            const sceneJustResumed: (runtimeScene: any) => any;
            const getSceneName: (runtimeScene: any) => any;
            const setBackgroundColor: (runtimeScene: any, rgbColor: any) => void;
            const getElapsedTimeInSeconds: (runtimeScene: any) => number;
            const setTimeScale: (runtimeScene: any, timeScale: any) => any;
            const getTimeScale: (runtimeScene: any) => any;
            const timerElapsedTime: (runtimeScene: any, timeInSeconds: any, timerName: any) => boolean;
            const timerPaused: (runtimeScene: any, timerName: any) => any;
            const resetTimer: (runtimeScene: any, timerName: any) => void;
            const pauseTimer: (runtimeScene: any, timerName: any) => void;
            const unpauseTimer: (runtimeScene: any, timerName: any) => any;
            const removeTimer: (runtimeScene: any, timerName: any) => void;
            const getTimerElapsedTimeInSeconds: (runtimeScene: any, timerName: any) => number;
            const getTimeFromStartInSeconds: (runtimeScene: any) => number;
            const getTime: (runtimeScene: any, what: any) => number;
            const replaceScene: (runtimeScene: any, newSceneName: any, clearOthers: any) => void;
            const pushScene: (runtimeScene: any, newSceneName: any) => void;
            const popScene: (runtimeScene: any) => void;
            const stopGame: (runtimeScene: any) => void;
            const createObjectsFromExternalLayout: (scene: any, externalLayout: any, xPos: any, yPos: any) => void;
        }
    }
}
