import { User } from "./schema";

async function createUser(user) {
  const dbUser = new User(user);
  await dbUser.save();
  return dbUser;
}

async function retrieveUserById(id) {
  return await User.findById(id);
}
async function retrieveUserByToken(authToken) {
  return await User.findOne({ authToken: authToken });
}

async function updateUserProfile(user) {
  const dbUser = await User.findById(user._id);

  if (dbUser) {
    dbUser.username = user.username;
    dbUser.email = user.email;
    dbUser.password = user.password;
    dbUser.authToken = user.authToken;
    await dbUser.save();
    return true;
  }

  return false;
}

async function retrieveUserByEmail(email) {
  return await User.findOne({ email: email });
}
async function retrieveUserByUsername(username) {
  return await User.findOne({ username: username });
}
async function retrieveUserByAuthToken(authToken) {
  return await User.findOne({ authToken: authToken });
}

export {
  createUser,
  retrieveUserById,
  updateUserProfile,
  retrieveUserByToken,
  retrieveUserByEmail,
  retrieveUserByUsername,
  retrieveUserByAuthToken,
};
