const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lq6k6.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const TodoCollection = client.db("Todo").collection("List");
    // create a document to insert
    app.post("/post", async (req, res) => {
      const add = req.body;
      const result = await TodoCollection.insertOne(add);
      res.send(result);
    });
    app.get("/post", async (req, res) => {
      const cursor = await TodoCollection.find({}).toArray();

      res.send(cursor);
    });
    app.delete("/delete", async (req, res) => {
      const data = req.body;
      const _id = ObjectId(data.id);
      const result = await TodoCollection.deleteOne({ _id });
      res.send(result);
    });
    app.put("/update", async (req, res) => {
      const data = req.body;
      const _id = ObjectId(data.id);
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          success: true,
        },
      };
      const result = await TodoCollection.updateOne(
        { _id },
        updateDoc,
        options
      );
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
require("dotenv").config();
app.get("/", (req, res) => {
  res.send("Port running on ");
});
app.listen(port, () => {
  console.log("running");
});
