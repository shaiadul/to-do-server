const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

app = express();
port = process.env.PORT || 5000


//middleware 
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
    console.log('mongodb connected');


    // home server title 
    app.get('/', (req, res) => {
      res.send('to-do list Server is Running Successfully.')
    })
    // list get
    app.get("/list", async (req, res) => {
      const list = await listCollection.find({}).toArray();
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
    //list PUT api
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

  }


  finally {
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log('ToDo List Server is Running');
})