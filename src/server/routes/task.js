const express = require('express');

const task = express.Router();

task.get('/log', (req, res) => {
  console.log('123');
  res.json({ sucess: true });
});

task.post('/items', (req, res) => {
  console.log(req.body);
  res.json({ sucess: true });
});

module.exports = task;
