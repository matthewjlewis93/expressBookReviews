const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) { //new user
      users.push({"username": username, "password": password})
      res.send(`User ${username} has been registered.`)
    } else {
      res.send("User already registered.")
    }
  } else {
    res.send("Username and password must be provided for registration.")
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200);
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let bookKeys = Object.keys(books);
  let bookList = {}
  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      bookList[key] = books[key]
    }
  }) 

  res.send(JSON.stringify(bookList,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let bookKeys = Object.keys(books);
  let bookList = {};
  bookKeys.forEach((key) => {
    if (books[key].title === title) {
      bookList[key] = books[key]
    }
  })
  res.send(JSON.stringify(bookList,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  res.send(JSON.stringify(reviews,null,4));
});

module.exports.general = public_users;
