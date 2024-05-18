const mongoose = require("mongoose");


mongoose.connect( 'mongodb+srv://gauravoppo9455:Gauravoppo9455@cluster0.elo0ivx.mongodb.net/todo-app');


//defining Schema
const UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    listItems :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'TodoList'
    }]
})

const TodoListSchema = new mongoose.Schema({
    title:String,
    description:String,
    completion:Boolean
})

const User = mongoose.model('User',UserSchema);
const TodoList = mongoose.model('TodoList',TodoListSchema);

module.exports ={
    User,
    TodoList
}

