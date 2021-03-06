import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4000;

// Set a server
app.listen(PORT, () => { // create a server
  console.log(`Server listening on http://localhost:${PORT} 🚀`);
});