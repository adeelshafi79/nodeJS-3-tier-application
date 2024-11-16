
// index.js
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Proxy requests to add a new user
app.post('/api/users', async (req, res) => {
  try {
    const response = await axios.post('http://backend:5000/users', req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error adding user');
  }
});

// Proxy request to get all users or search by username
app.get('/api/users', async (req, res) => {
  try {
    const { name } = req.query;
    const url = name
      ? `http://backend:5000/users?name=${encodeURIComponent(name)}`
      : 'http://backend:5000/users';
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
});

// Proxy request to update a user by ID
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.put(`http://backend:5000/users/${id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error updating user');
  }
});

// Start the frontend server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Frontend server running on port ${PORT}`));

