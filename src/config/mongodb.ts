import { MongoClient, Db } from "mongodb";

let db: Db;

export async function connectMongo() {
  const client = new MongoClient(
    process.env.MONGO_URL as string
  );

  await client.connect();

  db = client.db(
    process.env.MONGO_DATABASE
  );

  console.log("MongoDB connected");
}

export function getMongoDB(): Db {
  if (!db) {
    throw new Error(
      "MongoDB connection not initialized"
    );
  }

  return db;
}