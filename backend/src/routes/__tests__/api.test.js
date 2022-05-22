import routes from "../index";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import axios from "axios";

let mongod, app, server;
let user, note, event, bookmark;

/**
 * Before all tests, create an in-memory MongoDB instance so we don't have to test on a real database,
 * then establish a mongoose connection to it.
 *
 * Also, start an express server running on port 3001, hosting the routes we wish to test.
 */
beforeAll(async (done) => {
  mongod = await MongoMemoryServer.create();

  const connectionString = mongod.getUri();
  await mongoose.connect(connectionString, { useNewUrlParser: true });

  app = express();
  app.use("/", routes);
  server = app.listen(3001, () => done());
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
 *
 * Also, stop the express server
 */
afterAll((done) => {
  server.close(async () => {
    await mongoose.disconnect();
    await mongod.stop();

    done();
  });
});

it("test", async () => {
  const userResponse = await axios.get(
    "http://localhost:3001/api/user/userDetail"
  );
  const user = userResponse.data;
  const noteResponse = await axios.get(
    "http://localhost:3001/api/note/getNotes?userId=1"
  );
  const note = noteResponse.data;
  const eventResponse = await axios.get(
    "http://localhost:3001/api/event/getEvents"
  );
  const event = eventResponse.data;
  const bookmarkResponse = await axios.get(
    "http://localhost:3001/api/bookmark/getBookmark?userId=1"
  );
  const bookmark = bookmarkResponse.data;

  expect(user).toBeTruthy();
  expect(note).toBeTruthy();
  expect(event).toBeTruthy();
  expect(bookmark).toBeTruthy();
});

