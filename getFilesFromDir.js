const {statSync, readdirSync} = require("fs");
const {join} = require("path");

/**
 * @param {string} dirPath Path of the directory to get files from.
 * @param {boolean} recursive Get files recursively from directory.
 * @param {boolean} omitEmpty A flag to omit empty files from result.
 */
const getFilesFromDir = (dirPath, recursive, omitEmpty) => {
    if(!recursive){
        const fileList = readdirSync(dirPath);
        return fileList.filter(function(file) {
            const filePath = join(dirPath, file);
            const fileStats = statSync(filePath);
            return fileStats.isDirectory() ? false : omitEmpty ? !!fileStats.size : true;
        });

    }
    const files = [];
    (function getFilesRecursively(path) {
        const fileList = readdirSync(path);
        fileList.forEach(function(file) {
            const filePath = join(path, file);
            const fileStats = statSync(filePath);
            if (fileStats.isDirectory()) {
                getFilesRecursively(filePath);
            } else if (omitEmpty) {
                if(fileStats.size){
                    files.push(filePath);
                }
            } else {
                files.push(filePath);
            }
        });
    })(dirPath);
    return files;
};

module.exports.getFilesFromDir = getFilesFromDir;