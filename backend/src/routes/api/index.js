import express from "express";
import { verifyAuthenticated } from "../../middleware/middleware";

const router = express.Router();

import user from "./user";
router.use("/user", user);

// verify user is authenticated,then allow access to api
import note from "./note";
router.use("/note", verifyAuthenticated, note);

import event from "./event";
router.use("/event", verifyAuthenticated, event);

import bookmark from "./bookmark";
router.use("/bookmark", verifyAuthenticated, bookmark);

export default router;
