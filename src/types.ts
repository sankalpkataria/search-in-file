export type SearchOptions = {
    recursive?: boolean;
    words?: boolean;
    ignoreCase?: boolean;
    isRegex?: boolean;
    ignoreDir?: string[];
    fileMask?: string;
    searchResults?: SearchResults;
};

export type LineResult = {
    filePath: string;
    line: string;
    lineNo: number;
};

export const enum SearchResults {
    lineNo = 'lineNo',
    filePaths = 'filePaths',
};
