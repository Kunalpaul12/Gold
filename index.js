const express = require("express");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
const userName = encodeURIComponent("Kpaul");
const password = encodeURIComponent("Kunalpal@12");

const uri = `mongodb+srv://${userName}:${password}@golddata.arvcaoc.mongodb.net/?retryWrites=true&w=majority&appName=GoldData`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connect() {
  try {
    const conn = await client.connect();
    const db = await conn.db("GoldData");
    const collection = db.collection("Gold");
    return collection;
  } catch (err) {
    console.log(err);
  }
}
connect().catch(console.dir);

const app = express();
app.use(express.json());

app.post("/api/newGoldData", async (req, res) => {
  const data = req.body;
  const collection = await connect();

  collection
    .insertOne(data, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
    })
    .then(() => {
      res.send({ success: "entry create successfully" });
    });
});

app.get("/api/getGold", async (req, res) => {
  const collection = await connect();
  const result = await collection.find().toArray();
  res.send(result);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
