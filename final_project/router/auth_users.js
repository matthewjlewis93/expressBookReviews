const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  if (users.filter((user) => user.username === username).length != 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validUsers.length ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).send("Error logging in");
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 3600});

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User logged in successfully");
  } else {
    return res.send("Invalid login.")
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { username, review } = req.body;
  books[isbn].reviews[username] = review;
  res.send(`Review for ${books[isbn].title} has been posted by ${username}`)
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    res.send(`Deleted ${username}'s review for ${books[isbn].title}`);
  } else {
    res.send(`You have not posted a review of ${books[isbn].title}`);
  }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
