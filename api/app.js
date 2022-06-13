const express = require("express");
const cors = require("cors")
const fs = require("fs");
const todoListData = require("./todoList/todoList.json");

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(cors());


function updateFile(path, data) {
    fs.writeFile(path, data, (err) => {
        if (err) {
            return false;
        }
    });
    return true;
}


app.get('/todoLists', (req, res) => {
    const todoListData = require("./todoList/todoList.json");
    res.json(todoListData);
});

app.post('/todolists', (req, res) => {
    const body = req.body;

    if(body.title === '' && body.content === '') {
        res.json({succes: false, error: 'Input empty'});
    }

    let todoListData = require("./todoList/todoList.json");
    const id = parseInt(todoListData[todoListData.length - 1].id) + 1;
    todoListData.push({
        id: id,
        title: body.title,
        content: body.content
    });

    if(!updateFile('./todoList/todoList.json', JSON.stringify(todoListData))) {
        res.json({succes: false, error: 'Erreur !'});
    }

    res.json({succes: true, id: id});
});

app.delete('/todoLists/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id) || id <= 0) {
        res.json({succes: false, error: 'Error ID'});
    }

    let todoListData = require("./todoList/todoList.json");
    for (let i = 0; i < todoListData.length; i++) {
        if(parseInt(todoListData[i].id) === id) {
            todoListData.splice(i, 1);
        }
    }

    if(!updateFile('./todoList/todoList.json', JSON.stringify(todoListData))) {
       res.json({succes: false, error: 'Erreur !'});
   }

   res.json({succes: true});
})


app.listen(PORT, () => {
    console.log("Serveur à l'écoute sur le port : "+ PORT +"\nhttp://localhost:3000/");
})