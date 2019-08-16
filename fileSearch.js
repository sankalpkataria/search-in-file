const {createReadStream} = require("fs");
const {join} = require("path");

const searchForLineNos = (data, textToSearch, isRegex, regexOptions) => {
    const dataParts = data.split("\n");
    const foundLines = dataParts.filter(d => isRegex ?
        new RegExp(textToSearch, regexOptions).test(d) :
        d.includes(textToSearch));
    const result = foundLines.filter(d => d.length).map(line => ({
        line,
        lineNo: dataParts.indexOf(line) + 1
    }));
    return result.length ? result : false;
};

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
        if (!options.searchResults || options.searchResults !== "lineNo") return new RegExp(textToSearch, regexOptions).test(data);
        // search results must contain line numbers
        return searchForLineNos(data, textToSearch, true, regexOptions);
    } else {
        if (options.ignoreCase) {
            data = data.toLowerCase();
            textToSearch = textToSearch.toLowerCase();
        }
        if (!options.searchResults || options.searchResults !== "lineNo") return data.includes(textToSearch);
        // search results must contain line numbers
        return searchForLineNos(data, textToSearch, false);
    }
};

const readFileAndSearch = (filePath, textToSearch, options) => {
    return new Promise((resolve, reject) => {
        const readStream = createReadStream(filePath, {encoding: "utf-8"});
        readStream.on("data", data => {
            const result = search(data, textToSearch, options);
            if (result) {
                if (options.searchResults === "lineNo") return resolve({filePath, lines: JSON.stringify(result)});
                resolve(filePath);
                readStream.close();
            }
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