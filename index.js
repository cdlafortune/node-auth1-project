const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const userRouter = require('./users/users-router');

const server = express();
const port = process.env.PORT || 5000;

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use('/', userRouter);

server.use((err, req, res, next) => {
    console.log(err);

    res.status(500).json({message: 'Something went wrong.'});
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});