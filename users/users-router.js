const express = require('express');
const users = require('./users-model');

const router = express.Router();

router.get('/users', async (req, res, next) => {
    try {
        res.status(200).json(await users.find());
    } catch(err){
        next(err);
    }
});

router.post('/users', async (req, res, next) => {
    try {
        const {username, password} = req.body;
        const user = await users.findBy({username}).first();

        if(user) {
            return res.status(409).json({message: 'Username already taken.'});
        }

        const newUser = await users.add({username, password});

        res.status(201).json(newUser);
    } catch(err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const {username, password} = req.body;
        const user = await users.findBy({username}).first();

        if(!user) {
            return res.status(401).json({message: 'Invalid credentials.'})
        }

        res.json({message: `Welcome, ${user.username}!`});

    } catch(err) {
        next(err);
    }
});

module.exports = router;