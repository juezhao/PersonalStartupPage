import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, Note, Event, Bookmark } from "../schema";

let mongod;
let user, note, event, bookmark;

/**
 * Before all tests, create an in-memory MongoDB instance so we don't have to test on a real database,
 * then establish a mongoose connection to it.
 */
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  const connectionString = mongod.getUri();
  await mongoose.connect(connectionString, { useNewUrlParser: true });
});

/**
 * Before each test, intialize the database with some data
 */
beforeEach(async () => {
  user = {
    username: "test",
    password: "test",
    email: "test",
    authToken: "test",
    notes: [],
    events: [],
    bookmarks: [],
  };
  note = {
    content: "test",
    userId: 1,
  };
  event = {
    text: "test",
    statDateTime: "test",
    endDateTime: "test",
    evType: "2",
  };
  bookmark = {
    tabTitle: "test",
    url: "test",
    bookmarkTitle: "test",
    userId: 1,
  };
  const userColl = await mongoose.connection.db.createCollection("test-users");
  await userColl.insertOne(user);
  const noteColl = await mongoose.connection.db.createCollection("test-notes");
  await noteColl.insertOne(note);
  const eventColl = await mongoose.connection.db.createCollection(
    "test-events"
  );
  await eventColl.insertOne(event);
  const bookmarkColl = await mongoose.connection.db.createCollection(
    "test-bookmarks"
  );
  await bookmarkColl.insertOne(bookmark);
});

/**
 * After each test, clear the database entirely
 */
afterEach(async () => {
  await mongoose.connection.db.dropCollection("test-users");
  await mongoose.connection.db.dropCollection("test-notes");
  await mongoose.connection.db.dropCollection("test-events");
  await mongoose.connection.db.dropCollection("test-bookmarks");
});

/**
 * After all tests, gracefully terminate the in-memory MongoDB instance and mongoose connection.
 */
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

it("test", async () => {
  const user = await User.find();
  const note = await Note.find();
  const event = await Event.find();
  const bookmark = await Bookmark.find();
  expect(user).toBeTruthy();
  expect(note).toBeTruthy();
  expect(event).toBeTruthy();
  expect(bookmark).toBeTruthy();
});
