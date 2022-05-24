const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lgxtz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const database = client.db('lookUp');

        const productCollection = database.collection('products');
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('reviews');
        const userCollection = database.collection('users');

        //get product
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        //put users
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateEoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateEoc, options);
            res.send(result);
        })


        //get product by id
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })
        // post order
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })
        // get orders
        app.get('/order', async (req, res) => {
            const customer = req.query.customer;
            const query = { customer: customer };
            const orders = await orderCollection.find(query).toArray();
            res.send(orders);
        })
        //get reviews
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
            /*  const cursor = reviewCollection.find({});
             const reviews = await cursor.toArray();
             res.send(reviews); */
        })
        //post review
        app.post('/review', async (req, res) => {
            const order = req.body;
            const result = await reviewCollection.insertOne(order);
            res.send(result);
        })
        /*   app.get('/review', async (req, res) => {
              const cursor = reviewCollection.find({});
              const reviews = await cursor.toArray();
              console.log(reviews);
              res.send(reviews);
          }) */

    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello From Look Up!')
})

app.listen(port, () => {
    console.log(`Look Up App listening on port ${port}`)
})