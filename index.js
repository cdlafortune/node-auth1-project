const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const userRouter = require('./users/users-router');
const session = require('express-session');
const SessionStore = require('connect-session-knex')(session);
const server = express();
const port = process.env.PORT || 5000;
const db = require('./database/config');


server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session({
    secret: 'sdjskajsldjlkas',
    saveUninitialized: false,
    resave: false,
    store: new SessionStore({
        createTable: true,
        knex: db
    })
}));
server.use('/', userRouter);

// server.use((err, req, res, next) => {
//     console.log(err);

//     res.status(500).json({message: 'Something went wrong.'});
// });

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});