import express from "express";
import {
  createEvent,
  updateEvent,
  getEvents,
  deleteEvent,
} from "../../database/event-dao";
import mongoose from "mongoose";

const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;

const router = express.Router();

//create event
router.post("/createEvent", async (req, res) => {
  console.log("createEvent");
  const userId = res.locals.user._id;

  let { text, id, start_date, end_date, evType } = req.body;
  id = id.toString();
  try {
    const Events = await createEvent(
      userId,
      text,
      id,
      start_date,
      end_date,
      evType
    );

    res
      .status(HTTP_CREATED)
      .header("Location", `/api/createEvent`)
      .json(Events);
  } catch (error) {
    res
      .status(HTTP_NOT_FOUND)
      .header("Location", `/api/createEvent`)
      .json(false);
  }
});

// update Events
router.post("/updateEvent", async (req, res) => {
  console.log("updateEvent");
  const { text, id, start_date, end_date, evType } = req.body;
  try {
    const events = await updateEvent(text, id, start_date, end_date, evType);
    res
      .status(HTTP_CREATED)
      .header("Location", `/api/updateEvent`)
      .json(events);
  } catch (error) {
    res
      .status(HTTP_NOT_FOUND)
      .header("Location", `/api/updateEvent`)
      .json(false);
  }
});

//delete events
router.post("/deleteEvent", async (req, res) => {
  console.log("deleteEvent");
  const { id } = req.body;
  const userId = res.locals.user._id;
  try {
    const events = await deleteEvent(id, userId);
    res.status(HTTP_CREATED).header("Location", `/api/deleteNote`).json(events);
  } catch (error) {
    res
      .status(HTTP_NOT_FOUND)
      .header("Location", `/api/deleteNote`)
      .json(false);
  }
});

//get events
router.get("/getEvents", async (req, res) => {
  console.log("getEvents");
  try {
    const userId = res.locals.user._id;
    const events = await getEvents(userId);
    res.status(HTTP_CREATED).header("Location", `/api/getEvents`).json(events);
  } catch (error) {
    res.status(HTTP_NOT_FOUND).header("Location", `/api/getEvents`).json(false);
  }
});

export default router;
