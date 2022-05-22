import { User, Note } from "./schema";
import mongoose from "mongoose";

async function createNote(note, userId) {
  const dbNote = new Note({ content: note, user: userId });
  await dbNote.save();
  const user = await User.findById(userId);
  user.notes.push(dbNote._id);
  await user.save();
  return { id: dbNote.id };
}

async function getNotes(userId) {
  const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
  return notes;
}

async function updateNote(id, content) {
  return await Note.findByIdAndUpdate({ _id: id }, { content });
}

async function deleteNote(userId, noteId) {
  const user = await User.findById(userId);
  user.notes = user.notes.filter((note) => note._id.toString() !== noteId);
  await user.save();
  return await Note.deleteOne({ _id: noteId });
}

export { createNote, updateNote, getNotes, deleteNote };
