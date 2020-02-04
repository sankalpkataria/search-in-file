# Search In File

Includes utility methods and command to search text within file(s). 

## Installation
```
npm install search-in-file
```

## Usage
## As command line tool
To use this as a command line tool install this package globally using `-g` command.

Now, run command
``` 
search-in-file <text-to-search> 
```
For example, 
```
search-in-file hello
```
This will search for text `"hello"` in all the files from a directory where the command is run.

There are the following flags available with this commands:

`-p <path>`, `--path <path>` <path> : Path(s) of file/directory to search. Default: Current working directory

`-w`, `--word` : Search for exact word?

`-i`, `--ignore-case` : Ignore case while searching?

`--reg` : Consider "text-to-search" as regex?

`-r`, `--recursive` : Search recursively in sub-directories of a directory

`-e <exclude-dir>`, `--exclude-dir <exclude-dir>` : Directory/file(s) to exclude while searching

`-f <file-mask>`, `--file-mask <file-mask>` : Search in files with specific extension. Example: `".txt"`, `".js"`

`-s <type>`, `--search-results <type>` : Type of search result. `"filePaths"`/`"lineNo"`. Default: filePaths

> Paths should be absolute.

## Examples

```
search-in-file hello -p some-file-path
```
will search for text having `hello` in the specified file.

```
search-in-file hello -p some-dir-path
```
will search for text having `hello` in all the files in specified directory.

```
search-in-file hello -p some-dir-path -r
```
will search for text having `hello` in all the files in all subdirectories of the specified directory.

```
search-in-file hello -p some-dir-path -p some-other-dir-path
```
will search for text having `hello` in all the files in both the directories.

```
search-in-file hello -p some-dir-path -e dir-to-exclude
```
will search for text having `hello` in all the files in specified directory except the dir-to-exclude directory.

```
search-in-file hello -p some-dir-path -w
```
will search for the exact word `hello`.

```
search-in-file hello -p some-dir-path -w -i -f .txt
```
will search for the exact word `hello` (ignoring case) in all the with extension `".txt"` in the specified directory

```
search-in-file hello -p some-dir-path -w -s lineNo
```
will search for the exact word `hello` and output the files along with the line number where the text is found.

## Utility Methods
### `1. fileSearch(paths, textToSearch, options)`
> Search a text within files
>
> Parameters: 
> * paths: Absolute path files to search.
> * textToSearch: Text to search in files.
> * options: Various options for file search.
>
> Return value: A promise with a list of files in which text is present.

### `2. getFilesFromDir(dirPath, recursive, omitEmpty)`
> Get a list of files from a directory
>
> Parameters: 
> * dirPath: Path of the directory to get files from.
> * recursive: Get files recursively from directory.
> * omitEmpty: A flag to omit empty files from result.
>
> Return value: A list of files present in the given directory.

### `3. search(data, textToSearch, options)`
> Check if the text is present in given data
>
> Parameters: 
> * data: Data to search from.
> * textToSearch: Text to search.
> * options: Various options for search.
>
> Return value: true, if text is present in given data. Else false

## Available Options
* `recursive`: Searches recursively in all sub-directories and files. Default `false`
* `words`: Searches for the exact word. Default `false`
* `ignoreCase`: Case in-sensitive search. Default `false`
* `isRegex`: Searches for the regular expression. Default `false`
* `ignoreDir`: Ignore the specified directories/path while searching. Default `[]`
* `fileMask`: Only search in files with given extension. Default `null`
* `searchResults`: Type of search results to get. `lineNo` to get line with line number that contains given search text.  Default `filePaths`