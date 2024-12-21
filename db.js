const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
    email : {type : String, unique : true},
    firstName : String,
    lastName : String,
    password : String
});

const todoList = new Schema({
dateTime : Date,
isDone : Boolean,
task : String,
userObjectId : ObjectId
})


const UserModel = mongoose.model('users', User);
const TodoModel = mongoose.model('todoList', todoList);

module.exports = {
    UserModel : UserModel,
    TodoModel : TodoModel
}