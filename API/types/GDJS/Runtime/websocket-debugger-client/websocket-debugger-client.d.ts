declare namespace gdjs {
    /**
     * An client side implementation of the Debugger
     */
    export interface IDebuggerClient {
        /**
         * Update a value, specified by a path starting from the {@link RuntimeGame} instance.
         * @param path - The path to the variable, starting from {@link RuntimeGame}.
         * @param newValue - The new value.
         * @return Was the operation successful?
         */
        set(path: string[], newValue: any): boolean;
        /**
         * Call a method, specified by a path starting from the {@link RuntimeGame} instance.
         * @param path - The path to the method, starting from {@link RuntimeGame}.
         * @param args - The arguments to pass the method.
         * @return Was the operation successful?
         */
        call(path: string[], args: any[]): boolean;
        /**
         * Dump all the relevant data from the {@link RuntimeGame} instance and send it to the server.
         */
        sendRuntimeGameDump(): void;
        /**
         * Send logs from the hot reloader to the server.
         * @param logs The hot reloader logs.
         */
        sendHotReloaderLogs(logs: HotReloaderLog[]): void;
        /**
         * Callback called when profiling is starting.
         */
        sendProfilerStarted(): void;
        /**
         * Callback called when profiling is ending.
         */
        sendProfilerStopped(): void;
        /**
         * Send profiling results.
         * @param framesAverageMeasures The measures made for each frames.
         * @param stats Other measures done during the profiler run.
         */
        sendProfilerOutput(framesAverageMeasures: FrameMeasure, stats: ProfilerStats): void;
    }
    /**
     * A function used to replace circular references with a new value.
     * @param key - The key corresponding to the value.
     * @param value - The value.
     * @returns The new value.
     */
    type DebuggerClientCycleReplacer = (key: string, value: any) => any;
    /**
     * This {@link IDebuggerClient} connects to a websocket server, can dump
     * the data of the current game, and receive message to change a field or
     * call a function, specified by a path from the {@link RuntimeGame}.
     *
     * @param runtimeGame - The `gdjs.RuntimeGame` to be debugged
     */
    export class WebsocketDebuggerClient implements IDebuggerClient {
        _runtimegame: gdjs.RuntimeGame;
        _hotReloader: gdjs.HotReloader;
        _ws: WebSocket | null;
        /**
         * @param path - The path of the property to modify, starting from the RuntimeGame.
         */
        constructor(runtimeGame: RuntimeGame);
        set(path: string[], newValue: any): boolean;
        call(path: string[], args: any[]): boolean;
        sendRuntimeGameDump(): void;
        sendHotReloaderLogs(logs: HotReloaderLog[]): void;
        sendProfilerStarted(): void;
        sendProfilerStopped(): void;
        sendProfilerOutput(framesAverageMeasures: FrameMeasure, stats: ProfilerStats): void;
        /**
         * This is an alternative to JSON.stringify that ensure that circular references
         * are replaced by a placeholder.
         * @param obj - The object to serialize.
         * @param [replacer] - A function called for each property on the object or array being stringified, with the property key and its value, and that returns the new value. If not specified, values are not altered.
         * @param [maxDepth] - The maximum depth, after which values are replaced by a string ("[Max depth reached]"). If not specified, there is no maximum depth.
         * @param [spaces] - The number of spaces for indentation.
         * @param [cycleReplacer] - Function used to replace circular references with a new value.
         */
        _circularSafeStringify(obj: any, replacer?: DebuggerClientCycleReplacer, maxDepth?: number, spaces?: number, cycleReplacer?: DebuggerClientCycleReplacer): string;
        /**
         * Generates a JSON serializer that prevent circular references and stop if maxDepth is reached.
         * @param [replacer] - A function called for each property on the object or array being stringified, with the property key and its value, and that returns the new value. If not specified, values are not altered.
         * @param [cycleReplacer] - Function used to replace circular references with a new value.
         * @param [maxDepth] - The maximum depth, after which values are replaced by a string ("[Max depth reached]"). If not specified, there is no maximum depth.
         */
        _depthLimitedSerializer(replacer?: DebuggerClientCycleReplacer, cycleReplacer?: DebuggerClientCycleReplacer, maxDepth?: number): DebuggerClientCycleReplacer;
    }
    export const DebuggerClient: typeof WebsocketDebuggerClient;
    export {};
}
