const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Employee model
const Employee = mongoose.model('Employee', new mongoose.Schema({
  name: String,
  email: String,
  type: String,
  status: String,
}));

// Routes
app.post('/api/employees', async (req, res) => {
  const { name, email, type, status } = req.body;
  const employee = new Employee({ name, email, type, status });
  await employee.save();
  res.status(201).send(employee);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});