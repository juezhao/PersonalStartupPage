import express from "express";
import {
  createNote,
  updateNote,
  getNotes,
  deleteNote,
} from "../../database/note-dao";

const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;

const router = express.Router();

router.post("/createNote", async (req, res) => {
  console.log("createNote");
  const { note, userId } = req.body;
  try {
    const notes = await createNote(note, userId);
    res.status(HTTP_CREATED).header("Location", `/api/createNote`).json(notes);
  } catch (error) {
    res
      .status(HTTP_NOT_FOUND)
      .header("Location", `/api/createNote`)
      .json(false);
    console.log(error);
  }
});

router.post("/updateNote", async (req, res) => {
  console.log("createNote");
  const { id, note } = req.body;
  try {
    const notes = await updateNote(id, note);
    res.status(HTTP_CREATED).header("Location", `/api/updateNote`).json(notes);
  } catch (error) {
    res
      .status(HTTP_NOT_FOUND)
      .header("Location", `/api/updateNote`)
      .json(false);
  }
});

router.post("/deleteNote", async (req, res) => {
  console.log("createNote");
  const { id, userId } = req.body;
  try {
    const note = await deleteNote(userId, id);
    res.status(HTTP_CREATED).header("Location", `/api/deleteNote`).json(note);
  } catch (error) {
    res
      .status(HTTP_NOT_FOUND)
      .header("Location", `/api/deleteNote`)
      .json(false);
  }
});

router.get("/getNotes", async (req, res) => {
  console.log("getNotes");
  try {
    const { userId } = req.query;
    const notes = await getNotes(userId);
    res.status(HTTP_CREATED).header("Location", `/api/getNotes`).json(notes);
  } catch (error) {
    res.status(HTTP_NOT_FOUND).header("Location", `/api/getNotes`).json(false);
  }
});

export default router;
