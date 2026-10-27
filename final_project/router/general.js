
const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({
        message: "User successfully registered. Now you can login"
      });
    }
    return res.status(400).json({ message: "User already exists" });
  }

  return res.status(400).json({
    message: "Username and password are required"
  });
});

// Get all books using Axios and async/await
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get('http://localhost:5000');
    const book = response.data[isbn];

    if (book) {
      return res.status(200).json({ [isbn]: book });
    }
    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book" });
  }
});

// Get book details based on author using Axios
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const response = await axios.get('http://localhost:5000');
    const result = {};

    for (const isbn in response.data) {
      if (response.data[isbn].author.toLowerCase() === author) {
        result[isbn] = response.data[isbn];
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Get all books based on title using Axios
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const response = await axios.get('http://localhost:5000');
    const result = {};

    for (const isbn in response.data) {
      if (response.data[isbn].title.toLowerCase() === title) {
        result[isbn] = response.data[isbn];
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json({ [isbn]: book });
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
