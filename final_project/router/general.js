const express = require('express');
// let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;
axios.defaults.baseURL = 'http://localhost:5000'


public_users.get('/books', (req,res) => {
  res.send(require("./booksdb.js"));
})

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
public_users.get('/', async function (req, res) {
  let books = (await axios.get('/books')).data;
  res.status(200);
  res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  let books = (await axios.get('/books')).data;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  let books = (await axios.get("/books")).data
  let bookKeys = Object.keys(books);
  let bookList = {}
  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      bookList[key] = books[key]
    }
  }) 

  res.send(bookList);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const books = (await axios.get("/books")).data;
  let bookKeys = Object.keys(books);
  let bookList = {};
  bookKeys.forEach((key) => {
    if (books[key].title === title) {
      bookList[key] = books[key]
    }
  })
  res.send(bookList);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  res.send(JSON.stringify(reviews,null,4));
});

module.exports.general = public_users;
