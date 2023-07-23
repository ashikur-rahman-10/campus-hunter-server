const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()




// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Campus is Running.....................")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a46jnic.mongodb.net/?retryWrites=true&w=majority`;

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
        client.connect();
        const collegeCollection = client.db("CollegeHunterDB").collection("colleges");
        const galleryCollection = client.db("CollegeHunterDB").collection("graduateStudentsGallery");
        const researchPaperCollection = client.db("CollegeHunterDB").collection("researchPaper");
        const usersCollections = client.db("CollegeHunterDB").collection("users");

        // Get all colleges
        app.get('/colleges', async (req, res) => {
            const result = await collegeCollection.find().toArray();
            res.send(result)
        })

        // Get single college by id
        app.get('/college/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await collegeCollection.findOne(filter);
            res.send(result)
        })

        // Get Graduate Gallery
        app.get('/gallery', async (req, res) => {
            const result = await galleryCollection.find().toArray();
            res.send(result)
        })
        // Get Rechearch Paper
        app.get('/reaserch-paper', async (req, res) => {
            const result = await researchPaperCollection.find().toArray();
            res.send(result)
        })

        // Users Api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await usersCollections.findOne(query)
            if (existingUser) {
                return res.send({ message: "user already exist" })
            }
            const result = await usersCollections.insertOne(user);
            res.send(result)
        })

        // Get All Users
        app.get('/users', async (req, res) => {
            const result = await usersCollections.find().toArray()
            res.send(result)
        })

        // get single Users by Email
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const filter = { email: email };
            const resullt = await usersCollections.findOne(filter)
            res.send(resullt)
        })

        // Update User
        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    phone: updateInfo.phone,
                    address: updateInfo.address,
                    name: updateInfo.name,
                    university: updateInfo.university

                },
            };

            const result = await usersCollections.updateOne(filter, updateDoc)
            res.send(result)

            console.log(updateDoc);

        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Campus is running on port ${port}`)
})