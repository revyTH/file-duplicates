/**
 * ---------------------------------------------------------------------------------------
 * index.js
 * ---------------------------------------------------------------------------------------
 */


var fs              = require("fs"),
    path            = require("path"),
    minimatch       = require("minimatch");


//region private

function _filter(files, dirPath, ignorePatterns) {
    files = files.map(function(f) { return path.join(dirPath, f) } );

    files = files.filter(function(f) {
        return !ignorePatterns.some(function(p) {
            // pattern is a path
            if (p.dir !== "") {
                return minimatch(f, p.source);
            }
            //
            else {
                // file
                if (p.ext !== "") {
                    return minimatch(path.basename(f), p.source);
                }
                // folder
                else {
                    return minimatch(path.basename(f), p.source);
                }
            }
        });
    });

    return files;
}


function _find(buffer, dirPath, ignorePatterns, cb) {

    var result = [];

    fs.readdir(dirPath, function(err, files) {

        if (err) {
            return cb(err);
        }

        var filePaths = _filter(files, dirPath, ignorePatterns);
        var pending = filePaths.length;

        // empty folder, return cb
        if (pending === 0) {
            return cb(null, result);
        }

        filePaths.forEach(function(filePath) {
            fs.stat(filePath, function(err, stats) {
                if (err) {
                    return cb(err);
                }
                // if directory
                if (stats.isDirectory()) {
                    _find(buffer, filePath, ignorePatterns, function(err, res) {
                        result = result.concat(res);
                        pending--;
                        if (pending === 0) {
                            return cb(null, result);
                        }
                    });
                }
                // if file
                else {
                    fs.readFile(filePath, function(err, b){
                        if (b.compare(buffer) === 0) {
                            // equal file found
                            result.push(filePath);
                        }
                        pending--;
                        if (pending === 0) {
                            return cb(null, result);
                        }
                    });
                }
            });
        });
    });
}


function _find_sync(buffer, dirPath, ignorePatterns) {

    var result = [];
    var files = fs.readdirSync(dirPath);
    var queue = _filter(files, dirPath, ignorePatterns);

    while(queue.length > 0) {
        var filePath = queue.pop();
        var stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            files = fs.readdirSync(filePath);
            files = _filter(files, filePath, ignorePatterns);
            queue = queue.concat(files);
        }
        else {
            var fileBuffer = fs.readFileSync(filePath);
            if (fileBuffer.compare(buffer) === 0) {
                result.push(filePath);
            }
        }
    }

    return result;
}

//endregion


//region public

/**
 * Finds asynchronously the absolute paths of duplicated files of the target file or buffer in the specified directory.
 * @param {string or Buffer} pathOrBuffer - Path or buffer of the file to search.
 * @param {string} [dirPath] - Directory which represents the starting point of the search. Default is the working directory.
 * @param {Array} [ignorePatterns] - An array of patterns that will be excluded from the search (e.g. ["*.", "node_modules", "*.txt", "path/to/file", "path/to/directory"]).
 * @param {function} [cb] - Callback of type function(err, result). If not provided a Promise will be returned instead.
 * @return {} - Callback or Promise fulfilled with an array of absolute paths to duplicated files.
 */
function find(pathOrBuffer, dirPath, ignorePatterns, cb) {

    if (!(typeof pathOrBuffer === "string") && !(pathOrBuffer instanceof Buffer)) {
        throw Error("First argument must be a file path or a buffer");
    }

    if (!dirPath) {
        dirPath = process.cwd();
    }

    if (dirPath instanceof Array) {
        if (typeof ignorePatterns === "function") {
            cb = ignorePatterns;
        }
        ignorePatterns = dirPath;
        dirPath = process.cwd();
    }

    if (typeof dirPath === "function") {
        cb = dirPath;
        dirPath = process.cwd();
        ignorePatterns = []
    }

    if (dirPath && !path.isAbsolute(dirPath)) {
        dirPath = path.join(process.cwd(), dirPath);
    }

    if (typeof ignorePatterns === "function") {
        cb = ignorePatterns;
        ignorePatterns = [];
    }

    if (!ignorePatterns || !ignorePatterns instanceof Array) {
        ignorePatterns = [];
    }

    if (typeof pathOrBuffer === "string") {
        if (!path.isAbsolute(pathOrBuffer)) {
            ignorePatterns.push(path.join(process.cwd(), pathOrBuffer));
        }
        else {
            ignorePatterns.push(pathOrBuffer);
        }
    }

    ignorePatterns = ignorePatterns.map(function (p){
        var parsed = path.parse(p);
        parsed.source = p;
        return parsed;
    });

    // return promise
    if (!cb || typeof cb !== "function") {
        return new Promise(function(resolve, reject){
            // file path
            if (typeof pathOrBuffer === "string") {
                fs.readFile(pathOrBuffer, function(err, buffer){
                    if (err) {
                        reject(err);
                        return;
                    }
                    _find(buffer, dirPath, ignorePatterns, function(err, res){
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(res);
                        }
                    });
                });
            }
            // file buffer
            else {
                _find(pathOrBuffer, dirPath, ignorePatterns, function(err, res){
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            }
        });
    }
    // use callback
    else {
        // file path
        if (typeof pathOrBuffer === "string") {
            fs.readFile(pathOrBuffer, function(err, buffer){
                if (err) {
                    return cb(err);
                }
                return _find(buffer, dirPath, ignorePatterns, cb);
            });
        }
        // file buffer
        else {
            return _find(pathOrBuffer, dirPath, ignorePatterns, cb);
        }
    }
}


/**
 * Finds synchronously the absolute paths of duplicated files of the target file or buffer in the specified directory.
 * @param {string or Buffer} pathOrBuffer - Path or buffer of the file to search.
 * @param {string} [dirPath] - Directory which represents the starting point of the search. Default is the working directory.
 * @param {Array} [ignorePatterns] - An array of patterns that will be excluded from the search (e.g. ["*.", "node_modules", "*.txt", "path/to/file", "path/to/directory"]).
 * @return {Array} - An array of absolute paths to duplicated files.
 */
function findSync(pathOrBuffer, dirPath, ignorePatterns) {

    if (!(typeof pathOrBuffer === "string") && !(pathOrBuffer instanceof Buffer)) {
        throw Error("First argument must be a file path or a buffer");
    }

    if (!dirPath) {
        dirPath = process.cwd();
    }

    if (dirPath instanceof Array) {
        ignorePatterns = dirPath;
        dirPath = process.cwd();
    }

    if (dirPath && !path.isAbsolute(dirPath)) {
        dirPath = path.join(process.cwd(), dirPath);
    }

    if (!ignorePatterns || !ignorePatterns instanceof Array) {
        ignorePatterns = [];
    }

    if (typeof pathOrBuffer === "string") {
        if (!path.isAbsolute(pathOrBuffer)) {
            ignorePatterns.push(path.join(process.cwd(), pathOrBuffer));
        }
        else {
            ignorePatterns.push(pathOrBuffer);
        }
        pathOrBuffer = fs.readFileSync(pathOrBuffer);
    }

    ignorePatterns = ignorePatterns.map(function (p){
        var parsed = path.parse(p);
        parsed.source = p;
        return parsed;
    });

    return _find_sync(pathOrBuffer, dirPath, ignorePatterns);
}

//endregion






module.exports = {
    find: find,
    findSync: findSync
};