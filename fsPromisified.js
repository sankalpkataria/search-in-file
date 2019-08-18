const {promisify} = require("util");
const {stat, exists, readdir} = require("fs");

const statP = promisify(stat);
const existsP = promisify(exists);
const readdirP = promisify(readdir);

module.exports = {existsP, readdirP, statP};