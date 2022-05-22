import { User, Bookmark } from "./schema";

async function createBookmark(tabName, urlName, url, userId) {
  const dbBookmark = new Bookmark({
    tabTitle: tabName,
    user: userId,
    bookmarkTitle: urlName,
    url: url,
  });
  await dbBookmark.save();

  const user = await User.findOne({ _id: userId });
  user.bookmarks.push(dbBookmark._id);
  await user.save();

  return dbBookmark;
}

async function getBookmark(userId) {
  const bookmarks = await Bookmark.find({ user: userId });
  return bookmarks;
}

async function updateBookmarksTabName(oldTabName, newTabName, userId) {
  const bookmarks = await Bookmark.find({
    user: userId,
    tabTitle: oldTabName,
  }).update({ tabTitle: newTabName });
  return bookmarks;
}

async function deleteBookmark(id, userId) {
  const bookmarks = await Bookmark.deleteOne({ _id: id });
  const user = await User.findById(userId);
  user.bookmarks = user.bookmarks.filter((bookmark) => {
    return bookmark._id.toString() !== id;
  });
  await user.save();
  return bookmarks;
}

async function deleteBookmarksByTabName(tabName, userId) {
  const user = await User.findById(userId);
  let dbBookmarks = await Bookmark.find({ user: userId, tabTitle: tabName });
  let userBookmarks = new Set();
  dbBookmarks.forEach((bookmark) => {
    userBookmarks.add(bookmark._id.toString());
  });
  user.bookmarks = user.bookmarks.filter((bookmark) => {
    return !userBookmarks.has(bookmark._id.toString());
  });
  await user.save();
  const bookmarks = await Bookmark.deleteMany({
    user: userId,
    tabTitle: tabName,
  });
  return bookmarks;
}

async function isTheLastBookmark(tabName, userId) {
  const bookmarks = await Bookmark.find({ user: userId, tabTitle: tabName });
  return bookmarks;
}

export {
  createBookmark,
  updateBookmarksTabName,
  getBookmark,
  deleteBookmark,
  deleteBookmarksByTabName,
  isTheLastBookmark,
};
