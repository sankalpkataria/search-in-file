#!/usr/bin/env node

import { Command } from 'commander';
import { LineResult, SearchResults } from './types';
import { fileSearch } from '.';

function concatValues(value: string, previous: string[]) {
  return previous.concat([value]);
}

const program: Command & {
  textToSearch?: string;
  path?: string[];
  searchResults?: SearchResults;
  fileMask?: string | string[];
  excludeDir?: string[];
  word?: boolean;
  ignoreCase?: boolean;
  reg?: boolean;
  recursive?: boolean;
} = new Command('search-in-file')
  .version('3.2.2')
  .arguments('<text-to-search>')
  .usage('<text-to-search> [options]')
  .action((text) => {
    program.textToSearch = text;
  })
  .on('--help', () => {
    console.log();
    console.log('Only <text-to-search> is required');
  })
  .option(
    '-p, --path <path>',
    'Path(s) of file/directory to search. Default: Current working directory',
    concatValues,
    [],
  )
  .option('-w, --word', 'Search for exact word?', false)
  .option('-i, --ignore-case', 'Ignore case while searching?', false)
  .option('--reg', `Consider "text-to-search" as regex?`, false)
  .option(
    '-r, --recursive',
    `Search recursively in sub-directories of a directory`,
    false,
  )
  .option(
    '-e, --exclude-dir <exclude-dir>',
    'Directory/file(s) to exclude while searching',
    concatValues,
    [],
  )
  .option(
    '-f, --file-mask <file-mask>',
    `Search in files with specific extension. Example: ".txt", ".js"`,
  )
  .option(
    '-s, --search-results <type>',
    `Type of search result. "filePaths"/"lineNo". Default: filePaths`,
    'filePaths',
  );

program.parse(process.argv);

if (!program.textToSearch) {
  console.log();
  console.error('Please specify the text to search:');
  console.log(`\t${program.name()} <text-to-search>`);
  console.log();
  console.log('For example:');
  console.log(`\t${program.name()} hello`);
  console.log();
  console.log(`Run search-in-file --help to see all options.`);
  process.exit(1);
}

const textToSearch = program.textToSearch;
const paths = !program.path || !program.path.length ? [process.cwd()] : program.path;

if (
  program.searchResults &&
  program.searchResults !== 'filePaths' &&
  program.searchResults !== 'lineNo'
) {
  console.log("Invalid value for argument '--search-results'");
  console.log();
  console.log(`Run search-in-file --help to see all options.`);
  process.exit(1);
}

const options = {
  words: program.word,
  ignoreCase: program.ignoreCase,
  isRegex: program.reg,
  recursive: program.recursive,
  ignoreDir: program.excludeDir,
  fileMask: program.fileMask,
  searchResults: program.searchResults,
};

fileSearch(paths, textToSearch, options)
  .then((res) => {
    if (!res.length) {
      throw new Error('No results found.');
    }
    if (program.searchResults === 'lineNo') {
      res.forEach((r) => {
        if (r.length) {
          const [firstElem] = r as LineResult[];
          console.log();
          console.log(`filePath: ${firstElem.filePath}`);
          console.table(r, ['line', 'lineNo']);
        }
      });
    } else {
      console.table(res);
    }
  })
  .catch((err: Error) => {
    console.log(err.message || err);
  });
