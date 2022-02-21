import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express(); // express application

app.set("view engine", "pug");
app.set("views", process.cwd()+"/src/views");

// session middleware
app.use(morgan("dev")); // logger
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: "Hello!",
  resave: true,
  saveUninitialized: true,
}));

// locals middleware
app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;