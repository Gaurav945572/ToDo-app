const express = require("express")
const {UserZod,todoListZod,} = require("./type")
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const {jwtPassword} = require("./config");
const {UserMiddleware} = require("./middleware/usermiddleware");
const {User,TodoList} = require("./db")



//signup
app.post("/signup",async(req,res)=>{
    const  username = req.body.username;
    const password  = req.body.password;
    //console.log("I am here1");
    let parsedInput  = UserZod.safeParse({username,password});
    //console.log("I am here2");
    if(parsedInput.success){
        await User.create({
            username,
            password
        })
        res.json({
            "message":"User created successfully"
        })
    }
    else{
        res.status(404).json({
            "message":"Wrong input"
        })
    }
});




//signin
app.post("/signin", async(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    //checking input
    let parsedInput  = UserZod.safeParse({username,password});
    if(!parsedInput.success){
        res.status(404).json({
            "message":"invalid inputs",
        })
        return;
    }
    //first check the user exist or not
    let existingUser = await User.findOne({username,password});
    if(existingUser){
        const token = jwt.sign({username},jwtPassword);
        res.json({
            "token":token,
        })
    }
    else{
        res.status(404).json({
            "message":"wrong email and password",
        })
    }
});



//create the todo item
app.post("/createTodoitem",async(req,res)=>{
    let title = req.body.title;
    let description = req.body.description;
    let completion = req.body.completion;
    let parsedInput =  todoListZod.safeParse({title,description,completion});
    if(!parsedInput.success){
        res.status(404).json({
            "message":"invalid input"
        })
        return ;
    }
    await TodoList.create({
        title,
        description,
        completion
    })
    res.json({
        "message":"Item created successfully"
    })  
})

//add todo item
app.post("/addTodo/:ToDoId",UserMiddleware,async(req,res)=>{
    const username = req.username;  //from middleware
    const ToDoId = (req.params.ToDoId);
    await User.updateOne({
        username:username,
    },{
        "$push":{
            listItems :ToDoId,
        }
    })
    //console.log(User.find({username}))
    res.json({
        "message":"Items successfully added to your list",
    })
});




//get all todo
app.get("/todos",UserMiddleware, async(req,res)=>{
    const username = req.username; // get from usermiddleware
    const user = await User.findOne({username});
    console.log(user);
    const listItems = user.listItems;
        
        const list = await TodoList.find({
            _id: {
                "$in": listItems
            }
        });

        res.json({
            "ListItem": list
        });
});





//mark the todo list item to done
app.put("/complete/:id", UserMiddleware, async (req, res) => {
    const username = req.username;  // username got from middleware
    const todoItemId = req.params.id;  // todo list item id
    try {
        const user = await User.findOne({ username });  // finding the user corresponding to username
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const todoItem = user.listItems.find(item => item._id.toString() === todoItemId);// Update completion status
        if (!todoItem) {
            return res.status(404).json({ message: 'Todo item not found' });
        }
        TodoList.findOneAndUpdate({
            _id:todoItem
        },{
            $set:{completion:'true'}
        })
        let arr = TodoList.find({});
        console.log(arr);
        //todoItem.completion = true;// Update completion status
        await user.save();
        res.json({ message: 'Todo item updated successfully', todoItem });
    } catch (error) {
        console.error('Error updating todo item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});









app.listen(3000,()=>{
    console.log("Listening on 3000");
})
