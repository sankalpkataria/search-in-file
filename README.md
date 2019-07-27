# File Search
A utility to search a text within file(s).
## Available Functions
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
* `recursive`: Search recursively in all sub-directories and files. Default `false`