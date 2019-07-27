const {createReadStream} = require("fs");
const {join} = require("path");

const search = (data, textToSearch) => {
    return data.includes(textToSearch);
};

const readFileAndSearch = (filePath, textToSearch) => {
    return new Promise((resolve, reject) => {
        const readStream = createReadStream(filePath, {encoding: "utf-8"});
        readStream.on("data", data => {
            const result = search(data, textToSearch);
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