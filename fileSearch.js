const { createReadStream } = require("fs");
const { createInterface } = require('readline');

/**
 * Method to search the given text in the given data.
 *
 * @param {string} data Data on which search will be performed.
 * @param {string} textToSearch Text to search in file.
 * @param {object} options Various options for file search.
 * @returns {boolean} Returns true is text is present in given data. Else returns false
 */
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

/**
 * Method to read the given file and search for the given text line by line.
 *
 * @param {string} filePath Path of the file to search.
 * @param {string} textToSearch Text to search in file.
 * @param {object} options Various options for file search.
 * @returns {promise} Returns a promise that resolves with path of file, line and line number in which the given text is present.
 */
const searchLineByLine = (filePath, textToSearch, options) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = createReadStream(filePath, {encoding: "utf-8"});
        const lineReader = createInterface({
            input: stream
        });

        let lineNo = 0;

        lineReader.on('line', (line) => {
            lineNo++;
            if(search(line, textToSearch, options)) {
                results.push({ filePath, line: line.trim(), lineNo });
            }
        });

        lineReader.on('close', () => {
            resolve(results);
        });

        lineReader.on('error', (err) => {
            stream.close();
            reject(err);
        });
    });
}

/**
 * Method to read the given file and search for the given text.
 *
 * @param {string} filePath Path of the file to search.
 * @param {string} textToSearch Text to search in file.
 * @param {object} options Various options for file search.
 * @returns {promise} Returns a promise that resolves with path of file in which the given text is present.
 */
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