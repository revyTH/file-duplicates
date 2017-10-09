# file-duplicates
> During the development of a node app I had to check for potential duplicates of files uploaded by users. 
I wrote this package to address this particular problem: given in input a file or buffer, it returns the absolute 
paths to duplicated files starting from the specified directory (otherwise the working directory will be used as
starting point). The comparison between files is done at byte level. It is possible to provide an array of patterns to
ignore specific files or folders. Both sync and async API are provided. 



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
npm install --save file-equal-content
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
 * Finds asynchronously the absolute paths of duplicated files of the target file or buffer in the specified directory.
 * @param {string or Buffer} pathOrBuffer - Path or buffer of the file to search.
 * @param {string} [dirPath] - Directory which represents the starting point of the search. Default is the working directory.
 * @param {Array} [ignorePatterns] - An array of patterns that will be excluded from the search (e.g. ["*.", "node_modules", "*.txt", "path/to/file", "path/to/directory"]).
 * @param {function} [cb] - Callback of type function(err, result). If not provided a Promise will be returned instead.
 * @return {} - Callback or Promise fulfilled with an array of absolute paths to duplicated files.
 */
function find(pathOrBuffer, dirPath, ignorePatterns, cb) { }


/**
 * Finds synchronously the absolute paths of duplicated files of the target file or buffer in the specified directory.
 * @param {string or Buffer} pathOrBuffer - Path or buffer of the file to search.
 * @param {string} [dirPath] - Directory which represents the starting point of the search. Default is the working directory.
 * @param {Array} [ignorePatterns] - An array of patterns that will be excluded from the search (e.g. ["*.", "node_modules", "*.txt", "path/to/file", "path/to/directory"]).
 * @return {Array} - An array of absolute paths to duplicated files.
 */
function findSync(pathOrBuffer, dirPath, ignorePatterns) { } 
```


## Notes
* If dirPath is not provided, the search will start at working directory level (the one returned by process.cwd() i.e. the directory from which node command is invoked).
* I suggest to use always absolute paths. If you want to use relative paths, please make sure that they are relative to the directory specified as second argument or to the working directory (see above) if no directory is provided.


## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)