import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express(); // express application

app.set("view engine", "pug");
app.set("views", process.cwd()+"/src/views");

app.use(morgan("dev")); // logger
app.use(express.urlencoded({extended: true}));

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;