const patchUtil = require('jsondiffpatch');
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const compareDir = require("dir-compare").compareSync;

/**
 * The type corresponding to a PatchAuthor.
 * @typedef {Object} PatchAuthor The type corresponding to a Patch Author.
 * @property {string} name The name of the Author.
 * @property {string} description The "biography" of the author.
 */

/**
 * The type corresponding to a patch.
 * @typedef {Object} Patch The type corresponding to a patch.
 * @property {string} name The name of the patch.
 * @property {string} description The desription of the patch.
 * @property {string} content The content of the patch (patch itself).
 * @property {PatchAuthor} author The Author of the Patch.
 */

/**
 * The Operation to make with the patch.
 * @readonly
 * @enum {number} 
 */
const PATCH_OPERATIONS = {
    REMOVE_FILE: 0,
    CREATE_FILE: 2,
    REMOVE_DIRECTORY: 3,
    CREATE_DIRECTORY: 4,
    MODIFY: 5
}

/**
 * Creates a patch for a file.
 * @param {string} originalFilesPath Path to the original Files.
 * @param {string} modifiedFilesPath Path to the files with the patch added.
 * @param {{name: string, description: string, author: PatchAuthor}} [options] Options for the patch.
 * @returns {patch} The patch in JSON Format.
 */
const createPatch = function(originalFilesPath, modifiedFilesPath, options) {
    // Verification of options and filling in missing properties. Could Be optimized.
    if (options === undefined) {
        options = {
            name: "Patch",
            description: "A Patch",
            Author: {
                name: "DummyAuthor",
                description: "Someone."
            }
        }
    } else {
        if (options.name === undefined) {
            options.name = "Patch"
        }
        if (options.description === undefined) {
            options.description = "A Patch"
        }
        if (options.author === undefined) {
            options.Author = {
                name: "DummyAuthor",
                description: "Someone."
            }
        } else {
            if(options.author.name === undefined || options.author.description === undefined) {
                throw new Error("Invalid Author passed");
            }
        }
    }

    /** @type {Patch} */
    let patch = {
        name: options.name,
        description: options.description,
        author: options.author,
        content: null
    }

    let patchContent = []

    compareDir(originalFilesPath, modifiedFilesPath, {compareContent: true}).diffSet.forEach(file => {
        if (file.state !== "equal"){
            console.log(file);
            if (file.state === "distinct"){
                patchContent.push({
                    operation: PATCH_OPERATIONS.MODIFY,
                    name: path.join(file.relativePath ,file.name1), 
                    content: patchUtil.diff(
                        fs.readFileSync(path.join(originalFilesPath, file.relativePath, file.name1)),
                        fs.readFileSync(path.join(modifiedFilesPath, file.relativePath, file.name2))
                    )
                });
            } else {
                file.name1 ? file.name2 : file.name1;
                console.log(file.name1)
                if (file.type1 === "file" && file.type2 === "missing") {
                    patchContent.push({
                        operation: PATCH_OPERATIONS.REMOVE_FILE,
                        name: path.join(file.relativePath ,file.name1)
                    });
                }
                if (file.type1 === "missing" && file.type2 === "file") {
                    patchContent.push({
                        operation: PATCH_OPERATIONS.CREATE_FILE,
                        name: path.join(file.relativePath, file.name1)
                    });
                }
                if (file.type1 === "directory" && file.type2 === "missing") {
                    patchContent.push({
                        operation: PATCH_OPERATIONS.REMOVE_DIRECTORY,
                        name: path.join(file.relativePath, file.name1)
                    });
                }
                if (file.type1 === "missing" && file.type2 === "directory") {
                    patchContent.push({
                        operation: PATCH_OPERATIONS.CREATE_DIRECTORY,
                        name: path.join(file.relativePath, file.name1)
                    });
                }
            }
        }
    });
    console.log(patchContent);
}

/**
 * Adds a patch to the list of patches to apply with the loader
 * @param {string} patch The patch in JSON format.
 */
const addPatch = function(patch) {
    /** @type {Patch} */
    const patchObject = JSON.parse(patch);
    /** @type {string} */
    const patchDir = path.join(path.dirname(module.filename), "..", "Patches");
    
    /** @type {number} */
    let fileIndex = 0;
    for (let _ of fs.opendirSync(patchDir)){
        fileIndex++;
    }

    /** @type {string} */
    const filename =  patchDir + fileIndex.toString() + "-" + patchObject.name;

    fs.writeFileSync(filename, patch);
}

createPatch("C:\\Users\\Eliseflo\\AppData\\Local\\Programs\\miko_39s_32adventures\\resources\\app\\app", "C:\\Users\\Eliseflo\\AppData\\Local\\Programs\\miko_39s_32adventures\\resources\\app\\appm")

module.exports = createPatch
module.exports.addPatch = addPatch;