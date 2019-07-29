const {statSync, existsSync} = require("fs");
const {getFilesFromDir} = require("./getFilesFromDir.js");
const {readFileAndSearch, search} = require("./fileSearch.js");

/**
 * @param {string[]} paths file locations to search
 * @param {string} textToSearch Text to search in files
 * @param {object} options Various options for file search
 */
const fileSearch = (paths, textToSearch, options) => {
    if (!paths || !paths.length) return Promise.reject("File path is required");
    if (!(paths instanceof Array)) return Promise.reject("Path must be an array.");
    if (!options || !(options instanceof Object)) {
        options = {};
    }

    let allFiles = [];
    const areFilesPresent = paths.every(p => existsSync(p));
    if (!areFilesPresent) return Promise.reject("One of the file path doesn't exists.");

    allFiles = paths.reduce((result, p) => {
        const fileStats = statSync(p);
        if (!fileStats.isDirectory()) return result.concat([p]);
        const dirFiles = getFilesFromDir(p, options.recursive, true);
        return result.concat(dirFiles);
    }, []);

    if (options.ignoreDir && options.ignoreDir.length) {
        allFiles = allFiles.filter(filePath => !options.ignoreDir.some(path =>
            path === filePath || filePath.includes(path)));
    }

    if (options.fileMask) {
        allFiles = allFiles.filter(filePath => {
            const filePathParts = filePath.split(".");
            const fileExt = filePathParts[filePathParts.length - 1];
            return fileExt === options.fileMask;
        });
    }

    if (!allFiles.length) return Promise.reject(`No file to search. Either there are no files or files are empty`);
    const promises = allFiles.map(path => readFileAndSearch(path, textToSearch, options));
    return Promise.all(promises).then(files => files.filter(file => !!file));
};

module.exports.fileSearch = fileSearch;
module.exports.getFilesFromDir = getFilesFromDir;
module.exports.search = search;
