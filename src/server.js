import "./db";
import "./models/Video";
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express(); // express application

const PORT = 4000;

app.set("view engine", "pug");
app.set("views", process.cwd()+"/src/views");

app.use(morgan("dev")); // logger
app.use(express.urlencoded({extended: true}));

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

// Set a server
app.listen(PORT, () => { // create a server
  console.log(`Server listening on http://localhost:${PORT} 🚀`);
});