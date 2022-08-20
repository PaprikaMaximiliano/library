const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');

const { filesRouter } = require('./filesRouter.js');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(express.json());
app.use(morgan('combined', { stream: accessLogStream }));

app.use('/api/files', filesRouter);

const start = async () => {
    try {
        if (!fs.existsSync('files')) {
            fs.mkdirSync('files');
        }
        app.listen(8080);
    } catch (err) {
        console.error(`Error on server startup: ${err.message}`);
    }
};

start();

//ERROR HANDLER
app.use(errorHandler);

function errorHandler(err, req, res, next) {
    console.error('err');
    // prettier-ignore
    console.log("status code", err.status, 'err is',typeof err)
    res.status(err.status).send({ message: err.message });
}
