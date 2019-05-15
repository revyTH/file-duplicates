# file-duplicates
> Given in input a file or buffer, it returns the absolute 
paths to duplicated files starting from the specified directory (otherwise the working directory will be used as
starting point). The matching algorithm uses SHA-1 checksum to compare files. It is possible to provide an array of patterns to
ignore specific files or folders. Both sync and async API are available. 



## Information
| Package       | file-duplicates  |
| ------------- |--------------|                                   
| Node Version  | >= 4.8.4       |


## Table of Contents

<!-- toc -->

* [Information](#information)
* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
  * [find(String or Buffer, [String], [Array], [function])](#find)
  * [findSync(String or Buffer, [String], [Array], [function])](#findSync)
* [Notes](#notes)
* [License](#license)

<!-- toc stop -->


## Installation
Install package as dependency:
```shell
npm install --save file-duplicates
```


## Usage
```js
var fd = require("file-duplicates");
var fs = require("fs");
var filePath = "path/to/file";
var dirPath = "path/to/dir";

// async - promise
fd.find(filePath, dirPath).then(function(paths) {
    console.log(paths);
}).catch(err) {
    throw err;
};

// async - ignore patterns - callback
fd.find(filePath, dirPath, [".*", "node_modules", "**/*.txt", "path/to/specific/fileOrFolder"], function(err, paths) {
    if (err)
        throw err;
    console.log(paths);
});

// async with buffer
fs.readFile(filePath, function(err, buffer) {
    if (err)
        throw err;
    fs.find(buffer, dirPath, [".*", "*.js"]).then(function(paths) {
        console.log(paths);
    }).catch(function(err) {
        throw err;
    });
})

// sync (if not provided dirPath is the working directory)
var paths = fs.findSync(filePath, [".*", "*.js"]);
```


## API
```js
/**
 * Recursively search for duplicates of the target file or buffer in the specified directory, returning the corresponding absolute paths (ASYNC).
 * @param {string or Buffer} pathOrBuffer - Path or buffer of the file to search.
 * @param {string} [dirPath] - Directory which represents the starting point of the search. Default is the working directory.
 * @param {Array} [ignorePatterns] - An array of patterns that will be excluded from the search (e.g. ["*.", "node_modules", "*.txt", "path/to/file", "path/to/directory"]).
 * @param {function} [cb] - Callback of type function(err, result). If not provided a Promise will be returned instead.
 * @return {} - Callback or Promise fulfilled with an array of absolute paths to duplicated files.
 */
function find(pathOrBuffer, dirPath, ignorePatterns, cb) { }


/**
 * Recursively search for duplicates of the target file or buffer in the specified directory, returning the corresponding absolute paths (SYNC).
 * @param {string or Buffer} pathOrBuffer - Path or buffer of the file to search.
 * @param {string} [dirPath] - Directory which represents the starting point of the search. Default is the working directory.
 * @param {Array} [ignorePatterns] - An array of patterns that will be excluded from the search (e.g. ["*.", "node_modules", "*.txt", "path/to/file", "path/to/directory"]).
 * @return {Array} - An array of absolute paths to duplicated files.
 */
function findSync(pathOrBuffer, dirPath, ignorePatterns) { } 
```


## Notes
* If dirPath is not provided, the search will start at working directory level.
* For big files the async api is recommended. 


## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)