/**
 * ---------------------------------------------------------------------------------------------------------------------
 * test.js
 * ---------------------------------------------------------------------------------------------------------------------
 */

const path = require("path")
const expect = require("chai").expect
const fd = require("../index")

const dataPath = path.resolve(process.cwd(), "test", "data")
const nested1Path = path.resolve(dataPath, "nested1")
const nested2Path = path.resolve(nested1Path, "nested2")

describe("Find duplicates of file.txt", () => {

    const filePath = path.resolve(dataPath, "file.txt")
    const match1 = path.resolve(nested1Path, "file_copy1.txt")
    const match2 = path.resolve(nested2Path, "file_copy2.txt")

    // dirPath = process.cwd(); callback
    it("Should return paths to file_copy.txt and file_copy2.txt (CALLBACK)", () => {
        fd.find(filePath, (err, paths) => {
            expect(err).to.be.equal(null)
            expect(paths).to.not.equal(null)
            expect(paths[0]).to.be.equal(match1)
            expect(paths[1]).to.be.equal(match2)
        })
    })

    // dirPath = process.cwd(); promise
    it("Should return paths to file_copy.txt and file_copy2.txt (PROMISE)", () => {
        fd.find(filePath).then(paths => {
            expect(paths).to.not.equal(null)
            expect(paths[0]).to.be.equal(match1)
            expect(paths[1]).to.be.equal(match2)
        }).catch(err => {
            expect(err).to.be.equal(null)
        })
    })

    // dirPath = nested_2; callback
    it("Should return paths to file_copy2.txt (CALLBACK)", () => {
        fd.find(filePath, nested2Path, (err, paths) => {
            expect(err).to.be.equal(null)
            expect(paths).to.not.equal(null)
            expect(paths[0]).to.be.equal(match2)
        })
    })

    // dirPath = nested_2; promise
    it("Should return paths to file_copy2.txt (PROMISE)", () => {
        fd.find(filePath, nested2Path).then(paths => {
            expect(paths).to.not.equal(null)
            expect(paths[0]).to.be.equal(match2)
        }).catch(err => {
            expect(err).to.be.equal(null)
        })
    })

    // dirPath = process.cwd(); ignorePatterns = ["*copy2*"]; callback
    it("Should return paths to file_copy1.txt (CALLBACK)", () => {
        fd.find(filePath, ["*copy2*"], (err, paths) => {
            expect(err).to.be.equal(null)
            expect(paths).to.not.equal(null)
            expect(paths[0]).to.be.equal(match1)
        })
    })

    // dirPath = process.cwd(); ignorePatterns = ["*copy2*"]; promise
    it("Should return paths to file_copy1.txt (PROMISE)", () => {
        fd.find(filePath, ["*copy2*"]).then(paths => {
            expect(paths).to.not.equal(null)
            expect(paths[0]).to.be.equal(match1)
        }).catch(err => {
            expect(err).to.be.equal(null)
        })
    })
})

describe("Find duplicates of img.txt", () => {

    const imgPath = path.resolve(dataPath, "img.png")
    const match1 = path.resolve(nested1Path, "img_copy1.png")
    const match2 = path.resolve(nested2Path, "img_copy2.png")

    // dirPath = process.cwd(); callback
    it("Should return paths to img_copy.png and img_copy2.png (CALLBACK)", () => {
        fd.find(imgPath, (err, paths) => {
            expect(err).to.be.equal(null)
            expect(paths).to.not.equal(null)
            expect(paths[0]).to.be.equal(match1)
            expect(paths[1]).to.be.equal(match2)
        })
    })

    // dirPath = process.cwd(); promise
    it("Should return paths to img_copy.png and img_copy2.png (PROMISE)", () => {
        fd.find(imgPath).then(paths => {
            expect(paths).to.not.equal(null)
            expect(paths[0]).to.be.equal(match1)
            expect(paths[1]).to.be.equal(match2)
        }).catch(err => {
            expect(err).to.be.equal(null)
        })
    })

    // dirPath = nested_2; callback
    it("Should return paths to img_copy2.png (CALLBACK)", () => {
        fd.find(imgPath, nested2Path, (err, paths) => {
            expect(err).to.be.equal(null)
            expect(paths).to.not.equal(null)
            expect(paths[0]).to.be.equal(match2)
        })
    })

    // dirPath = nested_2; promise
    it("Should return paths to img_copy2.png (PROMISE)", () => {
        fd.find(imgPath, nested2Path).then(paths => {
            expect(paths).to.not.equal(null)
            expect(paths[0]).to.be.equal(match2)
        }).catch(err => {
            expect(err).to.be.equal(null)
        })
    })

    // dirPath = process.cwd(); ignorePatterns = ["*copy2*"]; callback
    it("Should return paths to img_copy1.png (CALLBACK)", () => {
        fd.find(imgPath, ["*copy2*"], (err, paths) => {
            expect(err).to.be.equal(null)
            expect(paths).to.not.equal(null)
            expect(paths[0]).to.be.equal(match1)
        })
    })

    // dirPath = process.cwd(); ignorePatterns = ["*copy2*"]; promise
    it("Should return paths to img_copy1.png (PROMISE)", () => {
        fd.find(imgPath, ["*copy2*"]).then(paths => {
            expect(paths).to.not.equal(null)
            expect(paths[0]).to.be.equal(match1)
        }).catch(err => {
            expect(err).to.be.equal(null)
        })
    })
})