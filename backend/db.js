const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

// Ensure the MONGODB_URI has been specified in a .env file.
if (!process.env.MONGODB_URI) {
    throw new Error("Please create a .env file in this directory containing your MONGODB_URI")
}

// Create mongodb connection manager.
const mongodb_client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

// INDEXES (Extra Credit)

// Initialize database indexes for faster query times as the db scales.
function initIndexes() {
    // Here is an example (though you might need to change db, collection, and key names):
    // Note: if you access a non-existant db name or collection name, then add something. mongodb will automatically create that db or collection.
    const db = mongodb_client.db("hw6");
    const users = db.collection("users");
    users.createIndexes([
        {
            key: { 'username': 1 }, // tells mongodb to index the username field ascending order. this will allow mongodb to find users of a particular username very efficiently.
            unique: true // tells mongodb there cannot be users with the same username.
        }
    ]);
}

// Check client connection and initialize indexes (if you choose to do so).
mongodb_client.connect().then(() => {
    // initIndexes(); // NOTE: Uncomment this line if you want to run initIndexes.
}).catch(err => {
    throw new Error("Unable to connect to mongodb cluster: " + err)
})

module.exports = { mongodb_client };