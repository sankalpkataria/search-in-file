const {createReadStream} = require("fs");
const {join} = require("path");

const search = (data, textToSearch, options) => {
    if (!options || !(options instanceof Object)) {
        options = {};
    }
    if (options.words) {
        options.isRegex = true;
        textToSearch = `\\b${textToSearch}\\b`;
    }
    if (options.isRegex) {
        let regexOptions = "g";
        if (options.ignoreCase) {
            regexOptions += "i";
        }
        return new RegExp(textToSearch, regexOptions).test(data);
    } else {
        if (options.ignoreCase) {
            data = data.toLowercase();
            textToSearch = textToSearch.toLowercase();
        }
        return data.includes(textToSearch);
    }
};

const readFileAndSearch = (filePath, textToSearch, options) => {
    return new Promise((resolve, reject) => {
        const readStream = createReadStream(filePath, {encoding: "utf-8"});
        readStream.on("data", data => {
            const result = search(data, textToSearch, options);
            if (result) {
                resolve(filePath);
            }
            readStream.close();
        });
        readStream.on("error", err => {
            readStream.close();
            reject(err);
        });
        readStream.on("close", resolve);
    });
};

module.exports.readFileAndSearch = readFileAndSearch;
module.exports.search = search;