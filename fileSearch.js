const { createReadStream } = require("fs");
const { once } = require('events');
const { createInterface } = require('readline');

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
            data = data.toLowerCase();
            textToSearch = textToSearch.toLowerCase();
        }
        return data.includes(textToSearch);
    }
};

const searchLineByLine = (filePath, textToSearch, options) => {
    const results = [];
    const stream = createReadStream(filePath, {encoding: "utf-8"});
    const lineReader = createInterface({
        input: stream
    });

    lineReader.on('line', (line) => {
        if(search(line, textToSearch, options)) {
            results.push({ filePath, line });
        }
    });

    return once(lineReader, 'close').then(function () {
        stream.close();
        return results;
    });
}

const readFileAndSearch = (filePath, textToSearch, options) => {
    return new Promise((resolve, reject) => {
        if (!options.searchResults || options.searchResults !== "lineNo") {
            const readStream = createReadStream(filePath, {encoding: "utf-8"});
            readStream.on("data", data => {
                const result = search(data, textToSearch, options);
                if (result) {
                    resolve(filePath);
                    readStream.close();
                }
            });
            readStream.on("error", err => {
                readStream.close();
                reject(err);
            });
            readStream.on("close", resolve);
        } else {
            // search results must contain line numbers
            searchLineByLine(filePath, textToSearch, options).then(function (results) {
                resolve(results);
            });
        }
        
    });
};

module.exports.readFileAndSearch = readFileAndSearch;
module.exports.search = search;