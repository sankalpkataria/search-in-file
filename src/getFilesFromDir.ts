import { Stats } from 'fs';
import { stat, readdir } from 'fs/promises';
import { join } from 'path';

// Using closure
const getFiles = async (path: string, omitEmpty: boolean) => {
  const files: string[] = [];
  const getFilesRecursively = async () => {
    const fileList = await readdir(path);
    const fileStatPromises: any = fileList.map(function (file) {
      const filePath: string = join(path, file);
      return stat(filePath).then((fileStat: Stats): any => {
        if (fileStat.isDirectory()) return getFilesRecursively();
        if (omitEmpty) return fileStat.size > 0 ? filePath : '';
        return filePath;
      });
    });
    const filesPaths = await Promise.all(fileStatPromises);
    const result = filesPaths.filter((file: string) => !!file);
    return files.concat(result);
  };
  return getFilesRecursively();
};

/**
 * @param {string} dirPath Path of the directory to get files from.
 * @param {boolean} recursive Get files recursively from directory.
 * @param {boolean} omitEmpty A flag to omit empty files from result.
 */
export const getFilesFromDir = (dirPath: string, recursive: boolean, omitEmpty: boolean) => {
  if (!recursive) {
    return readdir(dirPath).then((fileList) => {
      const fileStatPromises = fileList.map((file) => {
        const filePath = join(dirPath, file);
        return stat(filePath).then((fileStat) => {
          if (fileStat.isDirectory()) return false;
          if (omitEmpty) return fileStat.size > 0 ? filePath : false;
          return filePath;
        });
      });
      return Promise.all(fileStatPromises).then((files) => files.filter((file) => file));
    });
  }
  return getFiles(dirPath, omitEmpty);
};
