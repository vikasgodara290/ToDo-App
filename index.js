const express = require('express');
const app = express();
const port = 3001
const {UserModel, TodoModel} = require('./db');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://4ytvoch:5NbYQRNTUeT7KmPn@cluster0.s2ief.mongodb.net/todo_db');

const jwt = require('jsonwebtoken');
JSON_SECRET = "sdflksdfhlLHKKlhlkdfjdslk";

const cors = require('cors');

app.use(express.json());
app.use(cors());


let todoList = [];

function auth(req, res, next){
    const token = req.headers.token;
    console.log(token);
    
    let currentUser = null;
    try{
        currentUser = jwt.verify(token, JSON_SECRET);      
    }
    catch(err){
        res.status(401).send('unauthorized')
    }

    if(currentUser != null){
        req.headers.currentUserId = currentUser.id;
        next();
    }
}

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let currentUser = null;

    currentUser = await UserModel.findOne({
        email : email,
        password : password
    });
  
    if(currentUser != null){
        const token = jwt.sign({
            id : currentUser._id
        }, JSON_SECRET);
    
        res.json({
            token : token
        });
    }
    else{
        res.send('email or password is incorrect');
    }
});

app.post('/signup', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const newUser = await UserModel.create({
        email : email,
        password : password
    });
  
    if(newUser){
        res.json({
            msg : 'sign up success'
        });
    }
    else{
        res.send('something went wrong');
    }
});

app.post('/todo', auth, async (req, res) => {
    const task = req.body.task;
    const id = req.headers.currentUserId;
    
    await TodoModel.create({
        task : task,
        userObjectId : id
    });

    res.json('Success');
});

app.get('/todo', auth, async (req, res) => {
    const id = req.headers.currentUserId;
    const todoList = await TodoModel.find({userObjectId : id});
    res.json(todoList);
});

app.delete('/todo', auth, async (req, res) => {
    const todoItemId = req.query.id;
    
    await TodoModel.deleteOne({_id : todoItemId});
    res.json('deleted')
});

app.put('/todo', auth, async (req, res) => {
    const taskId = req.body.id;
    const task = req.body.task;
    console.log(taskId + task);
    
    await TodoModel.findOneAndUpdate({_id : taskId}, {$set : {task : task}})
    res.send('done')
});

app.listen(port, () => {
    console.log(`todo backend is listening to http://localhost:${port}`);
});