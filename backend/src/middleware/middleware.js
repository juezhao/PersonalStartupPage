import { retrieveUserByToken } from "../database/user-dao";

/**
 *
 * A global middleware to add user to locals after logging in
 */
async function addUserToLocals(req, res, next) {
   const user = await retrieveUserByToken(req.cookies.authToken);
  console.log("middleware---user");
  res.locals.user = user;
  next();
}

/**
 * A local middleware to verify user's login status and redirect user to different page base on user's login status
 */
function verifyAuthenticated(req, res, next) {
  if (res.locals.user) {
    next();
  } else {
    res.send("You are not logged in");
  }
}

export { addUserToLocals, verifyAuthenticated };
