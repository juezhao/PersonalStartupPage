import express from "express";
import {
  createBookmark,
  updateBookmarksTabName,
  getBookmark,
  deleteBookmark,
  deleteBookmarksByTabName,
  isTheLastBookmark,
} from "../../database/bookmark-dao";

const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;

const router = express.Router();

//create bookmark
router.post("/createBookmark", async (req, res) => {
  console.log("createBookmark");

  const { tabName, urlName, url } = req.body;
  const userId=res.locals.user._id;
  try {
    const bookmarks = await createBookmark(tabName, urlName, url, userId);

    res
      .status(HTTP_CREATED)
      .header("Location", `/api/createBookmark`)
      .json(bookmarks);
  } catch (error) {
    res
      .status(HTTP_NOT_FOUND)
      .header("Location", `/api/createBookmark`)
      .json(false);
  }
});

//update bookmarks by tab name
router.post("/updateBookmarksTabName", async (req, res) => {
  console.log("updateBookmarksTabName");
  const { oldTabName, newTabName } = req.body;
  const currentUserId = res.locals.user._id;

  try {
    const bookmarks = await updateBookmarksTabName(
      oldTabName,
      newTabName,
      currentUserId
    );
    res
      .status(HTTP_CREATED)
      .header("Location", `/api/updateBookmarksTabName`)
      .json(bookmarks);
  } catch (error) {
    res
      .status(HTTP_NOT_FOUND)
      .header("Location", `/api/updateBookmarksTabName`)
      .json(false);
  }
});

//get current user's bookmarks from db
router.get("/getBookmark", async (req, res) => {
  console.log("getBookmark");
  try {
    const { userId } = req.query;
    const bookmarks = await getBookmark(userId);

    res
      .status(HTTP_CREATED)
      .header("Location", `/api/getBookmark`)
      .json(bookmarks);
  } catch (error) {
    res
      .status(HTTP_NOT_FOUND)
      .header("Location", `/api/getBookmark`)
      .json(false);
  }
});

// delete one bookmark by bookmark _id
router.post("/deleteBookmark", async (req, res) => {
  console.log("deleteBookmark");
  const { id } = req.body;
  const userId = res.locals.user._id;

  try {
    const bookmarks = await deleteBookmark(id, userId);
    res
      .status(HTTP_CREATED)
      .header("Location", `/api/deleteBookmark`)
      .json(bookmarks);
  } catch (error) {
    console.log(error);
    res
      .status(HTTP_NOT_FOUND)
      .header("Location", `/api/deleteBookmark`)
      .json(false);
  }
});

// delete bookmarks by tabName
router.post("/deleteBookmarksByTabName", async (req, res) => {
  console.log("deleteBookmarksByTabName");
  const { tabName } = req.body;
  const currentUserId = res.locals.user._id;
  try {
    const bookmarks = await deleteBookmarksByTabName(tabName, currentUserId);

    res
      .status(HTTP_CREATED)
      .header("Location", `/api/deleteBookmarksByTabName`)
      .json(bookmarks);
  } catch (error) {
    res
      .status(HTTP_NOT_FOUND)
      .header("Location", `/api/deleteBookmarksByTabName`)
      .json(false);
  }
});

// identify if the bookmark is the last one in the tab

router.get("/isTheLastBookmark", async (req, res) => {
  console.log("isTheLastBookmark");
  const { tabName } = req.query;

  const currentUserId = res.locals.user._id;

  try {
    const bookmarks = await isTheLastBookmark(tabName, currentUserId);

    if (bookmarks.length == 0) {
      res.status(HTTP_CREATED).json(true);
    } else {
      res.status(HTTP_CREATED).json(false);
    }
  } catch (error) {
    res.status(HTTP_NOT_FOUND).json(false);
    console.log(error);
  }
});

export default router;
