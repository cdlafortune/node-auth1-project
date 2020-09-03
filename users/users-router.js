const express = require('express');
const users = require('./users-model');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.get('/users', (req, res) => {
    try {
        res.status(200).json(users.find());
    } catch {
        res.status(404).json({message: 'You shall not pass!'})
    }
});

router.post('/register', async (req, res, next) => {
    try {
        const credentials = req.body;
        // const {username} = req.body;
        // const user = users.findBy({username});

        // if(user) {
        //     return res.status(409).json({message: 'Username already taken.'});
        // }

        const hash =  bcrypt.hashSync(credentials.password, 8);
        console.log(hash);

        credentials.password = hash;

        const newUser = await users.add(credentials);

        res.status(201).json(newUser);
    } catch(err) {
        console.log("error:", err);
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const {username, password} = req.body;
        const user = await users.findBy({username}).first();

        if(!(bcrypt.compareSync(password, user.password))) {
            return res.status(401).json({message: 'Invalid credentials.'})
        }

        res.json({message: `Welcome, ${user.username}!`});

    } catch(err) {
        next(err);
    }
});

module.exports = router;