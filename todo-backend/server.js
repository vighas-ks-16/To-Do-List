//Using Express

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

// Create an instance of express
const app = express();
app.use(express.json())
app.use(cors())

//Sample in-memory storage for todo items
//let todos = [];


//Connecting mongodb
mongoose.connect('mongodb://localhost:27017/mern-todo')
.then(() => {
    console.log('DB Connected')
})
.catch((err) => {
    console.log(err)
})

//Creating Schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

//Creating Model
const todoModel = mongoose.model('Todo', todoSchema);



//Create a new todo item
app.post('/todos', async (req, res) => {
    const {title, description} = req.body;
    /*
    const newTodo = {
        id: todos.length + 1,
        title,
        description
    };
    todos.push(newTodo);
    console.log(todos);
    */
    try {
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
    

    
})

//Get all items
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    } 
})


// Update a todo item
app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const { title, description } = req.body;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json(updatedTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});



// Delete a todo item
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const deletedTodo = await todoModel.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});




//Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("Server is listening to port "+port);
})
