import { promises } from 'fs';
import { getFilesFromDir } from './getFilesFromDir';
import { readFileAndSearch, search } from './fileSearch';
import { LineResult, SearchOptions } from './types';

const { stat, access } = promises;

/**
 * @param {string[]} paths file locations to search
 * @param {string} textToSearch Text to search in files
 * @param {object} options Various options for file search
 */
const fileSearch = async (
  paths: string[],
  textToSearch: string,
  options: SearchOptions,
) => {
  if (!paths || !paths.length) throw new Error('File path is required');
  if (!(paths instanceof Array)) throw new Error('Path must be an array.');
  if (!options || !(options instanceof Object)) {
    options = {};
  }

  try {
    const filePromises = paths.map((p) => access(p));
    await Promise.all(filePromises);
  } catch (error) {
    throw new Error("One of the file path doesn't exists.");
  }

  const getFilesPromises = paths.map((p) =>
    stat(p).then((stat) => {
      return !stat.isDirectory()
        ? [p]
        : (getFilesFromDir(p, options.recursive || false, true) as Promise<string[]>);
    }),
  );

  const files = await Promise.all(getFilesPromises);

  let allFiles = files.reduce((result, fileArr) => {
    return result.concat(fileArr);
  }, []);

  if (options.ignoreDir && options.ignoreDir.length) {
    allFiles = allFiles.filter(
      (filePath: string) =>
        !options.ignoreDir?.some((path) => path === filePath || filePath.includes(path)),
    );
  }

  if (options.fileMask) {
    allFiles = allFiles.filter((filePath: string) => {
      const filePathParts = filePath.split('.');
      const fileExt = filePathParts[filePathParts.length - 1];
      if (options.fileMask instanceof Array) {
        return options.fileMask.some((fMask) => fileExt === fMask);
      }
      return fileExt === options.fileMask;
    });
  }

  if (!allFiles.length) {
    throw new Error('No file to search. Either there are no files or files are empty');
  }

  const promises = allFiles.map((path: string) =>
    readFileAndSearch(path, textToSearch, options),
  );

  const searchResults = (await Promise.all(promises)) as (string[] | LineResult[])[];
  return searchResults.filter((results: string[] | LineResult[]) => !!results.length);
};

export { fileSearch, search, getFilesFromDir };
