const express = require("express");
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

async function connect(collectionName) {
  try {
    const conn = await client.connect();
    const db = await conn.db("nmeesu");
    const collection = db.collection(collectionName);
    return collection;
  } catch (err) {
    console.log(err);
  }
}
connect().catch(console.dir);

const app = express();
app.use(express.json());

app.post("/api/signUp", async (req, res) => {
  const data = req.body;
  const collection = await connect("users");

  const errorValidate = (data) => {
    const errorReason = (data) => {
      if (!data.email) {
        return "please provided a email";
      } else if (!data.password) {
        return "please provided a password";
      } else if (!data.conformPassword) {
        return "please provided a conform password";
      } else if (!data.userName) {
        return "please provided a username";
      } else if (!data.country) {
        return "please provided a country";
      } else if (!data.phoneNumber) {
        return "please provided a phone number";
      } else if (data.password !== data.conformPassword) {
        return "password do not match";
      } else if (data.phoneNumber.length !== 10) {
        return "phone number not valid";
      }
    };

    return errorReason(data);
  };

  const isError = errorValidate(data);
  if (isError) {
    res.status(400);
    res.send({ error: isError });
    return;
  }

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

app.get("/api/allCountry", async (req, res) => {
  const collection = await connect("country");
  const result = await collection.find().toArray();
  res.send(result);
});

app.post("/api/login", async (req, res) => {
  const data = req.body;

  const errorValidate = (data) => {
    const errorReason = (data) => {
      if (!data.email && !data.userName) {
        return "please provided a email or username";
      } else if (!data.password) {
        return "please provided a password";
      }
    };

    return errorReason(data);
  };

  const isError = errorValidate(data);
  if (isError) {
    res.status(400);
    res.send({ error: isError });
    return;
  }

  const collection = await connect("users");
  const result = await collection
    .find({ $or: [{ email: data.email }, { userName: data.email }] })
    .toArray();
  if (result.length > 0) {
    res.send(result);
    return;
  }
  res.status(400);
  res.send({ error: "no user found" });
});

app.get("/api/allCatalogs", async (req, res) => {
  const collection = await connect("catalogs");
  const result = await collection.find().toArray();
  res.send(result);
});

app.get("/api/gender", async (req, res) => {
  const collection = await connect("gender");
  const result = await collection.find().toArray();
  res.send(result);
});

app.get("/api/occupation", async (req, res) => {
  const collection = await connect("occupation");
  const result = await collection.find().toArray();
  res.send(result);
});

app.get("/api/state", async (req, res) => {
  const collection = await connect("state");
  const result = await collection.find().toArray();
  res.send(result);
});

app.get("/api/language", async (req, res) => {
  const collection = await connect("language");
  const result = await collection.find().toArray();
  res.send(result);
});

app.post("/api/addUserDetails", async (req, res) => {
  setTimeout(async() => {
    const collection = await connect("user_details");
    const data = req.body;
  
    const errorValidate = (data) => {
      const errorReason = (data) => {
        if (!data.email) {
          return "please provided a email";
        } else if (!data.name) {
          return "please provided a name";
        } else if (!data.surname) {
          return "please provided a surname";
        } else if (!data.mobileNumber) {
          return "please provided a mobile number";
        }
      };
  
      return errorReason(data);
    };
  
    const isError = errorValidate(data);
    if (isError) {
      res.status(400);
      res.send({ error: isError });
      return;
    }
  
    collection.deleteMany()
  
    collection.insertOne(data, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
    })
    .then((result) => {
      res.send({ success: "entry create successfully",id: result.insertedId});
    });
  }, 2000)
 
});


app.get("/api/getUserDetails", async (req, res) => {
  setTimeout( async() => {  const collection = await connect("user_details");
    const result = await collection.find().toArray();
    res.send(result);},2000)

});

app.listen(8080, () => {
  console.log("Server listening on port 3000");
});
