const express = require("express");
const users = require("./users-model");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    if (req.session.user) {
      res.status(200).json(await users.find());
    } else {
      throw new Error("Unauthorized");
    }
  } catch {
    res.status(404).json({ message: "You shall not pass!" });
  }
});

router.post("/register", validateUser, (req, res) => {
  let newUser = req.body;

  const hash = bcrypt.hashSync(newUser.password, 8);

  newUser.password = hash;

  users
    .add(newUser)
    .then((saved) => {
      res.status(201).json(saved);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Username must be unique." });
    });
});

router.post("/login", validateUser, (req, res) => {
  const { username, password } = req.body;

  users
    .findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome, ${user.username}` });
      } else {
        res.status(401).json({ message: "Invalid credentials." });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//middleware
function validateUser(req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ message: "Username & password are required." });
  } else {
    next();
  }
}

module.exports = router;
