const {statP, readdirP} = require("./fsPromisified");
const {join} = require("path");

/**
 * @param {string} dirPath Path of the directory to get files from.
 * @param {boolean} recursive Get files recursively from directory.
 * @param {boolean} omitEmpty A flag to omit empty files from result.
 */
const getFilesFromDir = (dirPath, recursive, omitEmpty) => {
    if (!recursive) {
        return readdirP(dirPath).then(fileList => {
            const fileStatPromises = fileList.map(file => {
                const filePath = join(dirPath, file);
                return statP(filePath).then(fileStat => {
                    if (fileStat.isDirectory()) return false;
                    if (omitEmpty) return fileStat.size > 0 ? filePath : false;
                    return filePath;
                });
            });
            return Promise.all(fileStatPromises).then(files => files.filter(file => file));
        })
    }
    let files = [];
    return (function getFilesRecursively(path) {
        return readdirP(path).then(fileList => {
            const fileStatPromises = fileList.map(function (file) {
                const filePath = join(path, file);
                return statP(filePath).then(fileStat => {
                    if (fileStat.isDirectory()) return getFilesRecursively(filePath);
                    if (omitEmpty) return fileStat.size > 0 ? filePath : false;
                    return filePath;
                });
            });
            return Promise.all(fileStatPromises).then(filesPaths => {
                const result = filesPaths.filter(file => file);
                files = files.concat(result);
            });
        });
    })(dirPath).then(() => files);
};

module.exports.getFilesFromDir = getFilesFromDir;