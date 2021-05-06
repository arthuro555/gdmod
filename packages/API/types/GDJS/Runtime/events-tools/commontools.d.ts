declare namespace gdjs {
    namespace evtTools {
        namespace common {
            /**
             * Get the value of a variable. Equivalent to `variable.getAsNumber()`.
             * @param variable Variable.
             * @returns The content of the variable, as a number.
             */
            const getVariableNumber: (variable: gdjs.Variable) => number;
            /**
             * Get the string of a variable. Equivalent to `variable.getAsString()`.
             * @param variable Variable.
             * @returns The content of the variable, as a string.
             */
            const getVariableString: (variable: gdjs.Variable) => string;
            /**
             * Compares the boolean value of a variable.
             * Equivalent to `variable.getAsBoolean() === boolean`.
             * This shortcut function is needed for events code generation.
             *
             * @param {gdjs.Variable} variable
             * @param {boolean} compareWith
             * @returns {boolean}
             * @private
             */
            const getVariableBoolean: (variable: gdjs.Variable, compareWith: boolean) => boolean;
            /**
             * Set the boolean value of a variable. Equivalent to `variable.setBoolean()`.
             * This shortcut function is needed for events code generation.
             *
             * @param {gdjs.Variable} variable
             * @param {boolean} bool The new boolean value of the variable.
             * @private
             */
            const setVariableBoolean: (variable: gdjs.Variable, newValue: boolean) => void;
            /**
             * Toggles the boolean value of a variable.
             * @param {gdjs.Variable} variable Variable.
             * @private
             */
            const toggleVariableBoolean: (variable: gdjs.Variable) => void;
            /**
             * Check if a scene variable exists.
             * @param runtimeScene The scene.
             * @param variableName Name of the scene variable.
             * @returns true if the scene variable exits, false otherwise.
             */
            const sceneVariableExists: (runtimeScene: gdjs.RuntimeScene, variableName: string) => boolean;
            /**
             * Check if a global variable exists.
             * @param runtimeScene The scene.
             * @param variableName Name of the global variable.
             * @returns true if the global variable exits, false otherwise.
             */
            const globalVariableExists: (runtimeScene: gdjs.RuntimeScene, variableName: string) => boolean;
            /**
             * Check if a child exists in a variable.
             * @param variable Variable.
             * @param childName Name of the child.
             * @returns true if child exist in the variable, false otherwise.
             */
            const variableChildExists: (variable: gdjs.Variable, childName: string) => boolean;
            /**
             * Remove the child with the given name in a variable.
             * @param variable Variable.
             * @param childName Name of the child.
             * @returns The new variable, with the child removed.
             */
            const variableRemoveChild: (variable: gdjs.Variable, childName: string) => void;
            /**
             * Clear the children in a variable.
             * @param variable Variable.
             */
            const variableClearChildren: (variable: gdjs.Variable) => void;
            /**
             * Pushes a variable onto an array.
             * @param {gdjs.Variable} array
             * @param {gdjs.Variable} variable
             * @private
             */
            const variablePushCopy: (array: gdjs.Variable, variable: gdjs.Variable) => void;
            /**
             * Pushes a value onto an array.
             * @param {gdjs.Variable} array
             * @param {string | float | boolean} value
             * @private
             */
            const valuePush: (array: gdjs.Variable, value: string | float | boolean) => void;
            /**
             * Removes an index from an array.
             *
             * @param {gdjs.Variable} array
             * @param {number} index
             * @private
             */
            const variableRemoveAt: (array: gdjs.Variable, index: number) => void;
            /**
             * Get the number of children in a variable.
             * @param variable Variable.
             * @returns The number of children in the variable.
             */
            const getVariableChildCount: (variable: gdjs.Variable) => number;
            /**
             * Convert a string to a number.
             * @param str String to convert.
             * @returns The parsed number, or NaN if invalid.
             */
            const toNumber: (str: string) => number;
            /**
             * Convert a number to a string.
             * @param num Value to convert to a string.
             * @returns The value as a string.
             */
            const toString: (num: number) => string;
            /**
             * Negate the boolean.
             * @param bool The boolean to negate.
             * @returns The negated value.
             */
            const logicalNegation: (bool: boolean) => boolean;
            /**
             * Normalize a value between `min` and `max` to a value between 0 and 1.
             * @param {number} val The value to normalize
             * @param {number} min The minimum
             * @param {number} max The maximum
             * @returns The normalized value between 0 and 1
             */
            const normalize: (val: float, min: float, max: float) => number;
            /**
             * Limit a value to a range.
             * @param x Value.
             * @param min The minimum value.
             * @param max The  maximum value.
             * @returns The new value.
             */
            const clamp: (x: float, min: number, max: float) => number;
            /**
             * Hyperbolic arc-cosine
             * @param arg Value.
             * @returns The hyperbolic arc-cosine for the value.
             */
            const acosh: (arg: integer) => number;
            /**
             * Hyperbolic arcsine
             * @param arg Value.
             * @returns The hyperbolic arcsine for the value.
             */
            const asinh: (arg: integer) => number;
            /**
             * Hyperbolic arctangent
             * @param arg Value.
             * @returns The hyperbolic arctangent for the value.
             */
            const atanh: (arg: integer) => number;
            /**
             * Hyperbolic cosine
             * @param arg Value.
             * @returns The hyperbolic cosine for the value.
             */
            const cosh: (arg: integer) => number;
            /**
             * Hyperbolic sine
             * @param arg Value.
             * @returns The hyperbolic sine for the value.
             */
            const sinh: (arg: integer) => number;
            /**
             * Hyperbolic tangent
             * @param arg Value.
             * @returns The hyperbolic tangent for the value.
             */
            const tanh: (arg: integer) => number;
            /**
             * Cotangent
             * @param arg Value.
             * @returns The cotangent for the value.
             */
            const cot: (arg: integer) => number;
            /**
             * Cosecant
             * @param arg Value.
             * @returns The cosecant for the value.
             */
            const csc: (arg: integer) => number;
            /**
             * Secant
             * @param arg Value.
             * @returns The secant for the value.
             */
            const sec: (arg: integer) => number;
            /**
             * Base-10 logarithm
             * @param arg Value.
             * @returns The base-10 logarithm for the value.
             */
            const log10: (arg: integer) => number;
            /**
             * Base-2 logarithm
             * @param arg Value.
             * @returns The base-2 logarithm for the value.
             */
            const log2: (arg: integer) => number;
            /**
             * Returns the sign of the number. This checks if the value is positive, negative or zero.
             * @param arg Value.
             * @returns Return the sign for the value (1, -1 or 0).
             */
            const sign: (arg: integer) => number;
            /**
             * Cube root
             * @param x Value.
             * @returns Return the cube root for the value.
             */
            const cbrt: (x: float) => number;
            /**
             * N-th root
             * @param x Base value.
             * @param n Exponent value.
             * @returns Return the n-th root for the value.
             */
            const nthroot: (x: float, n: number) => number;
            /**
             * Modulo operation (the remainder after dividing one number by another)
             * @param x Dividend value.
             * @param y Divisor value.
             * @returns Return the remainder for the values.
             */
            const mod: (x: float, y: float) => number;
            /**
             * Returns the difference between two angles, in degrees.
             * @param angle1 First angle, in degrees.
             * @param angle2 Second angle, in degrees.
             * @returns Return the difference of the angles, in degrees.
             */
            const angleDifference: (angle1: number, angle2: number) => number;
            /**
             * Returns the angle, in degrees, between two positions.
             * @param x1 First point X position.
             * @param y1 First point Y position.
             * @param x2 Second point X position.
             * @param y2 Second point Y position.
             * @returns The angle between the positions, in degrees.
             */
            const angleBetweenPositions: (x1: number, y1: number, x2: number, y2: number) => number;
            /**
             * Returns the distance, in pixels, between two positions.
             * @param x1 First point X position.
             * @param y1 First point Y position.
             * @param x2 Second point X position.
             * @param y2 Second point Y position.
             * @returns The distance between the positions, in pixels.
             */
            const distanceBetweenPositions: (x1: number, y1: number, x2: number, y2: number) => number;
            /**
             * Runs a linear interpolation between a and b.
             * @param a Start value.
             * @param b End value.
             * @param x The interpolation value between 0 and 1.
             * @returns The interpolated value, now between a and b.
             */
            const lerp: (a: number, b: integer, x: float) => number;
            /**
             * Truncate a number.
             * @param x Value.
             * @returns Return the value with all decimal places dropped.
             */
            const trunc: (x: float) => number;
            /**
             * Compute the X position when given an angle and distance relative to the origin (0;0).
             * This is also known as getting the cartesian coordinates of a 2D vector, using its polar coordinates.
             * @param angle The angle, in degrees.
             * @param distance The distance from the object, in pixels.
             */
            const getXFromAngleAndDistance: (angle: float, distance: float) => number;
            /**
             * Compute the Y position when given an angle and distance relative to the origin (0;0).
             * This is also known as getting the cartesian coordinates of a 2D vector, using its polar coordinates.
             * @param angle The angle, in degrees.
             * @param distance The distance from the object, in pixels.
             */
            const getYFromAngleAndDistance: (angle: float, distance: float) => number;
        }
    }
}
