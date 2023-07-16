const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/task');

const app = express();

const databaseId = "mongodb+srv://user1:abcdefgh@nodepractice.z6hssea.mongodb.net/";

mongoose.connect(databaseId, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/', (req, res) => {
  res.redirect('/tasks');
});

app.get('/about', (req, res) => {
  res.render('about', {title: 'About'});
});

app.get('/tasks/create', (req, res) => {
  res.render('create', {title: 'Create a new task'});
});

app.get('/tasks', (req, res) => {
  Task.find().sort({createdAt: -1})
    .then(result => {
      res.render('index', {tasks: result, title: 'All tasks'});
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/tasks', (req, res) => {
  const task = new Task(req.body);

  task.save()
    .then((result) => {
      res.redirect('/tasks');
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  Task.findById(id)
    .then((result) => {
      res.render('details', {task: result, title: 'Task Details'});
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  Task.findByIdAndDelete(id)
    .then((result) => {
      res.json({redirect: '/tasks'});
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res) => {
  res.status(404).render('404', {title: '404'});
});