// config/db.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  if (db) return db;
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("MongoDB connected successfully!");
  db = client.db("securePass");
  return db;
}

module.exports = connectDB;