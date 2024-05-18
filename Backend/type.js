const Zod = require("zod");


const UserZod = Zod.object({
    username:Zod.string().email(),
    password:Zod.string().min(5),
})

const todoListZod = Zod.object({
    title:Zod.string(),
    description: Zod.string(),
    completion:Zod.boolean()
});


const updatetodoZod = Zod.object({
    id : Zod.string(),
})


module.exports ={
    updatetodoZod,
    todoListZod,
    UserZod
};