import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube");

const db = mongoose.connection;
db.on("error", (error) => console.log("❌ DB Error", error)); // many times
db.once("open", () => console.log("✅ Connected to DB")); // only one time