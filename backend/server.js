const express = require('express');
const app = express();
const pool = require('./db'); // PostgreSQL connection setup
const cors = require('cors');

app.use(cors());
app.use(express.json()); // For parsing JSON request bodies

// CREATE a new user
app.post('/users', async (req, res) => {
  console.log(req.body)
  const { name, email } = req.body;
  try {
    const newUser = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error creating new user' });
  }
});

// READ all users
app.get('/users', async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT * FROM users');
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.post('/search', async (req, res) => {

  const { name } = req.body;
  console.log(req.body)
  console.log(name)

  try{
    const user = await pool.query('SELECT * FROM users WHERE name = $1', [name]);
    res.json(user.rows[0] || { message: 'User not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
})

// READ a single user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.json(user.rows[0] || { message: 'User not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// UPDATE a user
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updatedUser = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );
    res.json(updatedUser.rows[0] || { message: 'User not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// DELETE a user
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    res.json(result.rows[0] ? { message: 'User deleted' } : { message: 'User not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));

