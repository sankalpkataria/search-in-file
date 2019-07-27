const {statSync, existsSync} = require("fs");
const {getFilesFromDir} = require("./getFilesFromDir.js");
const {readFileAndSearch} = require("./fileSearch.js");

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

    if (!allFiles.length) return Promise.reject(`No file to search. Either there are no files or files are empty`);
    const promises = allFiles.map(path => readFileAndSearch(path, textToSearch, options));
    return Promise.all(promises).then(files => files.filter(file => !!file));
};

module.exports.getFilesFromDir = getFilesFromDir;
module.exports.fileSearch = fileSearch;