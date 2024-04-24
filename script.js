const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for the user
const userSchema = new mongoose.Schema({
  username: String,
  contact: String,
  email: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('formHtml')); // Assuming your HTML file is in a 'public' directory

// Route to serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'formHtml', 'form.html'));
});

// Route for handling form submission
app.post('/', (req, res) => {
  const newUser = new User({
    username: req.body.username,
    contact: req.body.contact,
    email: req.body.email,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (err) {
      console.error('Error saving user:', err);
      res.status(500).send('Error saving user');
    } else {
      console.log('User saved successfully');
      res.status(200).send('User saved successfully');
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
