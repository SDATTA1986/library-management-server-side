const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());



const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4qnhmwc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //  await client.connect();

    const userCollection = client.db("BookCategory").collection("Category");
    const bookCollection = client.db("AllBook").collection("Book");

    app.get("/Category", async (req, res) => {
      const result = await userCollection.find().toArray();
      console.log(result);
      res.send(result);

    });

    app.post("/Book", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await bookCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });

    app.get("/Book", async (req, res) => {
      const result = await bookCollection.find().toArray();
      console.log(result);
      res.send(result);

    });

    app.patch("/Book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedProduct = req.body;
  
      // Ensure that Quantity is a valid number
      // if (!isNaN(updatedProduct.quantity)) {
      //   updatedProduct.quantity = parseInt(updatedProduct.quantity);
      // } else {
      //   updatedProduct.quantity = 0;
      // }
      console.log(updatedProduct);
      const product = {
        $set: {
          Quantity: updatedProduct.Quantity,
        }
      };
      const result = await bookCollection.updateOne(filter, product);
      res.send(result);
    })

    app.patch("/Booking/:Name", async (req, res) => {
      const Name = req.params.Name;
      const filter = { Name: Name };
      const updatedProduct = req.body;
  
      // Ensure that Quantity is a valid number
      // if (!isNaN(updatedProduct.quantity)) {
      //   updatedProduct.quantity = parseInt(updatedProduct.quantity);
      // } else {
      //   updatedProduct.quantity = 0;
      // }
      console.log(updatedProduct);
      const product = {
        $set: {
          Quantity: updatedProduct.Quantity,
        }
      };
      const result = await bookCollection.updateOne(filter, product);
      res.send(result);
    })

    app.get("/Book/:id", async(req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        const result=await bookCollection.findOne(query);
        res.send(result);
      })

    app.put("/Book/:id",async(req,res)=>{
        const id=req.params.id;
        const filter={_id:new ObjectId(id)}
        const options={upsert:true};
        const updatedProduct=req.body;
        const product={
          $set:{
            Name:updatedProduct.Name,
            Image:updatedProduct.Image,
            Category:updatedProduct.Category,
            authorName:updatedProduct.authorName,
            Rating:updatedProduct.Rating,
            Description:updatedProduct.Description,
            Quantity:updatedProduct.Quantity
          }
        }
        const result=await bookCollection.updateOne(filter,product,options);
        res.send(result);
      })

    app.get("/Books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await bookCollection.findOne(query);
      res.send(result);
    })

    const userCollection2 = client.db("BorrowedBook").collection("BookCart");
    app.post("/BookCart", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection2.insertOne(user);
      console.log(result);
      res.send(result);
    });

    app.get("/BookCart", async (req, res) => {
      const result = await userCollection2.find().toArray();
      console.log(result);
      res.send(result);

    });

    app.delete("/BookCart/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", typeof (id));
      const objectId = new ObjectId(id);
      console.log(objectId);
      const query = {
        _id: objectId,
      };
      console.log(query);
      const result = await userCollection2.deleteOne(query);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("CRUD is running....");
})

app.listen(port, () => {
  console.log(`App is running on PORT: ${port}`);
})