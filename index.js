const {statP, existsP} = require("./fsPromisified");
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

    const filePromises = paths.map(p => existsP(p));
    return Promise.all(filePromises).then(files => {
        const areFilesPresent = files.every(file => file);
        if (!areFilesPresent) return Promise.reject("One of the file path doesn't exists.");
        const filePromises = paths.map(p => statP(p).then(stat => {
            return !stat.isDirectory() ? [p] : getFilesFromDir(p, options.recursive, true);
        }));
        return Promise.all(filePromises);
    }).then(files => {
        let allFiles = files.reduce((result, fileArr) => {
            return result.concat(fileArr);
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
        return Promise.all(promises);
    }).then(files => {
        return files.filter(file => !!file)
    });
};

module.exports.fileSearch = fileSearch;
module.exports.getFilesFromDir = getFilesFromDir;
module.exports.search = search;