const mongoose = require('mongoose');
const excels = require('./routes/excels');
const skills = require('./routes/skills');
const express = require('express');
const app = express();
const cors=require('cors')

mongoose.connect('mongodb://127.0.0.1:27017/ExcelDb')
  .then(() => console.log('Connected to MongoDB...'))
app.use(express.json());
app.use(cors())
// app.use('/api/genres', genres);
// app.use('/api/customers', customers);
// app.use('/api/movies', movies);
// app.use('/api/employees', employees);
app.use('/api/excels', excels);
app.use('/api/skills', skills);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));