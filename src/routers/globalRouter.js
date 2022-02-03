import express from "express";
import { join, login } from "../controllers/userController";
import { trend, search } from "../controllers/videoController";

const globalRouter = express.Router();
const handleHome = (req, res) => res.send("Home");

globalRouter.get("/", trend);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter;