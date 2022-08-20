// requires...
const fs = require('fs');
const path = require('path');
// constants...
function createFile(req, res, next) {
    // Your code to create the file.
    const { filename, content } = req.body;
    const filePath = './files/' + filename;

    if (filename === undefined || filename == null || filename === '' || !filename.includes('.')) {
        // prettier-ignore
        return next({
            message: `Please specify 'filename' parameter.`,
            status: 400
        });
    }

    if (content === undefined || content == null || content === '') {
        // prettier-ignore
        return next(
            {
                message: `Please specify 'content' parameter.`,
                status: 400
            }
        );
    }

    if (fs.existsSync(filePath)) {
        // prettier-ignore
        return next(
            {
                message: 'File already exists.',
                status: 400
            }
        );
    }

    if (!isValidExt(filePath)) {
        // prettier-ignore
        return next(
            {
                message:
                    'Please choose one of the supported extensions: .log, .txt, .json, .yaml, .xml, .js',
                status: 400
            }
        );
    }
    fs.writeFile(filePath, content, (err) => (err ? console.log(err) : null));
    res.status(200).json({ message: 'File created successfully' });
}

function getFiles(req, res, next) {
    // Your code to get all files.

    res.status(200).send({
        message: 'Success',
        files: fs.readdirSync('./files/', (err) => {
            if (err) {
                console.log(err);
            }
        })
    });
}

const getFile = (req, res, next) => {
    const { filename } = req.params;
    const filePath = './files/' + filename;

    if (!fs.existsSync(filePath)) {
        return next({
            message: `No file with filename '${filename}' found`,
            status: 400
        });
    }

    res.status(200).send({
        message: 'Success',
        filename: filename,
        content: fs.readFileSync(filePath).toString(),
        extension: path.extname(filePath).substring(1),
        uploadedDate: fs.statSync(filePath).birthtime
    });
};

// Other functions - editFile, deleteFile
function isValidExt(filePath) {
    const validExtensions = ['.log', '.txt', '.json', '.yaml', '.xml', '.js'];
    return validExtensions.includes(path.extname(filePath));
}

// path.extName('file.txt') ---> '.txt'
// fs.writeFile ({ flag: 'a' }) ---> adds content to the file

module.exports = {
    createFile,
    getFiles,
    getFile
};
