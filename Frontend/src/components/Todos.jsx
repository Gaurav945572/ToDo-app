// todos =[{
//     title,description,completion
// },{
//     title,description,completion
// }];

import { useState } from "react";


export function Todos({todos}){
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    return <div>
        {
            todos.map((todo)=>{
                return <div>
                <h3 onChange={function(e){
                    const val = e.target.value;
                    setTitle[val];
                }}>todo.title</h3>

                <h4 onChange={function(e){
                    const val = e.target.value;
                    setDescription[val];
                }}>todo.description</h4>
                
                <button onClick={()=>{
                    fetch("https://localhost:3000/createTodoitem",{
                        method:"POST",
                        body:JSON.stringify({
                            title :title,
                            description:description,
                        }),
                        headers:{
                            "content-type":"application/json"
                        }
                    }).then(async function(res){
                        const json = await res.json();
                        alert("todo added");

                    })
                }}>{todo.completion==true?"completed":"MArk as completed"}</button>
                </div>
            })
        }
    </div>
}