import mongoose from "mongoose";

//Create Schema
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    authToken: {
      type: String,
      default: "",
    },
    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
        default: [],
      },
    ],
    events: [
      {
        type: String,
        ref: "Todo",
        default: [],
      },
    ],
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bookmark",
        default: [],
      },
    ],
  },
  { timestamps: {} }
);

const User = mongoose.model("User", userSchema);

const NoteSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: {} }
);
const Note = mongoose.model("Note", NoteSchema);

const EventSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    _id: {
      type: String,
      required: true,
    },
    startDateTime: {
      type: String,
      required: true,
    },
    endDateTime: {
      type: String,
      required: true,
    },
    evType: {
      type: String,
      required: true,
      default: "2",
    },
  },

  { timestamps: {} }
);
const Event = mongoose.model("Event", EventSchema);

const bookmarkSchema = new Schema(
  {
    tabTitle: {
      type: String,
      required: true,
      unique: false,
    },
    bookmarkTitle: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: {} }
);
const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export { User, Note, Event, Bookmark };
