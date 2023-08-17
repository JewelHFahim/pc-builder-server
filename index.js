require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pahlhyl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("pcbuilder");
    const productCollection = db.collection("product");
    const pcbuilderCollection = db.collection("pcbuilder");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });


    app.post("/product", async (req, res) => {
      const product = req.body;
    
      try {
        const result = await productCollection.insertOne(product);
        if (result.insertedCount === 1) {
          res.status(201).json({ message: "Product inserted successfully.", insertedId: result.insertedId });
        } else {
          res.status(500).json({ message: "Product insertion failed." });
        }
      } catch (error) {
        console.error("Error inserting product:", error);
        res.status(500).json({ message: "An error occurred while inserting the product." });
      }
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({
        _id: new ObjectId(id),
      });
      console.log(result);
      res.send(result);
    });


    // PC Builder Collections
    app.get("/pcbuilder", async (req, res) => {
      const cursor = pcbuilderCollection.find({});
      const product = await cursor.toArray();

      res.send(product);
    });

    app.get("/pcbuilder/:id", async (req, res) => {
      const id = req.params.id;
      const result = await pcbuilderCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });


  
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello- PC Builder!");
});

app.listen(port, () => {
  console.log(`PC Builder app running on port ${port}`);
});
