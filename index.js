const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

app = express();
port = process.env.PORT || 5000


//middleware to connect application
app.use(cors());
app.use(express.json());


// ----------------
const uri = `mongodb+srv://${[process.env.USER_NAME]}:${process.env.USER_PASS}@mongodot.anhqpqi.mongodb.net/?retryWrites=true&w=majority`
// ----------------
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

  try {
    await client.connect();
    const listCollection = client.db("ToDoList").collection("list");
    const completeCollection = client.db("ToDoList").collection("completed");
    console.log('mongodb connected');


    // home server title 
    app.get('/', (req, res) => {
      res.send('to-do list Server is Running Successfully.')
    })
    // list get
    app.get("/list", async (req, res) => {
      const list = await (await listCollection.find({}).toArray()).reverse();
      res.send(list);
    });
    // list Post api 
    app.post('/list', async (req, res) => {
      const data = req.body;
      const result = await listCollection.insertOne(data);
      res.send(result)
    });
    // get list id api
    app.get('/list/:id', async (req, res) => {
      const id = req.params;
      const query = { _id: ObjectId(id) };
      const result = await listCollection.findOne(query);
      res.send(result);
    });
    // delete a list
    app.delete("/list/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await listCollection.deleteOne(query);
      res.send(result);
    })
    //list update api
    app.put("/list/:id", async (req, res) => {
      const { id } = req.params;
      const newText = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateText = {
        $set: {
          value: newText.value,
        },
      };
      const result = await listCollection.updateOne(
        filter,
        updateText,
        options
      );
      res.send(result);
    });
    // _________________________________________________
    // checkbox and complete task
    app.patch("/Checkbox/:id", async (req, res) => {
      const data = req.params.CheckID;
      const id = { _id: ObjectId(data) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          Checkbox: true,
        },
      };
      const result = await completeCollection.updateOne(id, updateDoc, options);
      res.send(result);
    });
    // posting completed task
    app.post("/completed", async (req, res) => {
      const completed = req.body;
      const result = await completeCollection.insertOne(completed);
      res.send(result);
    });
    // all complete api
    app.get('/completed', async (req, res) => {
      const query = {};
      const cursor = completeCollection.find(query);
      const completed = await cursor.toArray();
      res.send(completed);
    });

  }

  // --------------end-------------


  finally {
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log('ToDo List Server is Running');
})