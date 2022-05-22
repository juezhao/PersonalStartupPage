import express from "express";
import { v4 as uuidv4 } from "uuid";
import {
  createUser,
  updateUserProfile,
  retrieveUserByEmail,
  retrieveUserByUsername,
} from "../../database/user-dao";
import bcrypt from "bcrypt";
import { verifyAuthenticated } from "../../middleware/middleware";

const saltRounds = 10;
const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;

const router = express.Router();

//create user, use bcrypt to hash the password
router.post("/register", async (req, res) => {
  console.log("signup");
  const { signup_username, signup_email, signup_repeatpassword } = req.body;
  const user = {
    username: signup_username,
    email: signup_email,
  };
  try {
    bcrypt.hash(signup_repeatpassword, saltRounds, async function (err, hash) {
      const newUser = await createUser({
        ...user,
        password: hash,
      });
    });
    res
      .status(HTTP_CREATED)
      .header("Location", `/api/register`)
      .json("success");
  } catch (error) {
    res.status(HTTP_NOT_FOUND).header("Location", `/api/register`).json(false);
    console.log(error);
  }
});

//update user profile
router.post("/updateUser", verifyAuthenticated,async (req, res) => {
  console.log("updateUser");
  const { username, email, repeatpassword} = req.body;
  try {
    const newUser = {
      _id: res.locals.user._id,
      authToken: res.locals.user.authToken,
      username,
      email,
    };
    bcrypt.hash(repeatpassword, saltRounds, async function (err, hash) {
      newUser.password = hash;
      await updateUserProfile(newUser);
    });
    res
      .status(HTTP_CREATED)
      .header("Location", `/api/updateUser`)
      .json(newUser._id);
  } catch (error) {
    res
      .status(HTTP_NOT_FOUND)
      .header("Location", `/api/updateUser`)
      .json(false);
  }
});
//update user password with the random password sent from frontend when user forget password
router.post("/forgetPassword", async (req, res) => {
  console.log("updateUser");
  const { username, email, randomPassword,id } = req.body;
  try {
    const newUser = {
      _id: id,
      authToken: '',
      username,
      email,
    };
    bcrypt.hash(randomPassword, saltRounds, async function (err, hash) {
      newUser.password = hash;
      await updateUserProfile(newUser);
    });
    res
      .status(HTTP_CREATED)
      .header("Location", `/api/forgetPassword`)
      .json(newUser._id);
  } catch (error) {
    res
      .status(HTTP_NOT_FOUND)
      .header("Location", `/api/forgetPassword`)
      .json(false);
  }
});

//check if the old password is correct
router.post("/checkOldPassword", verifyAuthenticated, async (req, res) => {
  console.log("checkOldPassword");
  const { old_password } = req.body;
  const currentHashPassword = res.locals.user.password;
  try {
    bcrypt.compare(old_password, currentHashPassword, function (err, result) {
      if (result) {
        res.status(HTTP_CREATED).json(true);
      } else {
        res.status(HTTP_CREATED).json(false);
      }
    });
  } catch (error) {
    res.status(HTTP_NOT_FOUND).json(false);
  }
});

//check username uniqueness
router.get("/checkUsername", async (req, res) => {
  console.log("checkUsername");
  const { username } = req.query;
  try {
    const user = await retrieveUserByUsername(username);
    if (user) {
      res.status(HTTP_CREATED).json({ username,email:user.email,id:user._id });
    } else {
      res.status(HTTP_CREATED).json(false);
    }
  } catch (error) {
    res.status(HTTP_NOT_FOUND).json(false);
  }
});

router.get("/checkUpdatedUsername", verifyAuthenticated, async (req, res) => {
  console.log("check updated username");
  const currentName = res.locals.user.username;
  const { username } = req.query;
  try {
    const user = await retrieveUserByUsername(username);
    if (user && username !== currentName) {
      res.status(HTTP_CREATED).json(username);
    } else {
      res.status(HTTP_CREATED).json(false);
    }
  } catch (error) {
    res.status(HTTP_NOT_FOUND).json(false);
  }
});

//check email uniqueness
router.get("/checkEmail", async (req, res) => {
  console.log("check email");
  const { email } = req.query;
  try {
    const user = await retrieveUserByEmail(email);
    if (user) {
      res.status(HTTP_CREATED).json(email);
    } else {
      res.status(HTTP_CREATED).json(false);
    }
  } catch (error) {
    res.status(HTTP_NOT_FOUND).json(false);
  }
});
router.get("/checkUpdatedEmail", verifyAuthenticated, async (req, res) => {
  const currentEmail = res.locals.user.email;
  console.log("check update email");
  const { email } = req.query;
  try {
    const user = await retrieveUserByEmail(email);
    if (user && email !== currentEmail) {
      res.status(HTTP_CREATED).json(email);
    } else {
      res.status(HTTP_CREATED).json(false);
    }
  } catch (error) {
    res.status(HTTP_NOT_FOUND).json(false);
  }
});

//login, compare the password with the hash password, if correct, generate the cookie authToken and a local user in the backend
router.post("/login", async (req, res) => {
  const { login_username, login_password } = req.body;
  console.log("in login");
  try {
    const user = await retrieveUserByUsername(login_username);

    const password = user ? user.password : 0;

    bcrypt.compare(login_password, password, async function (err, result) {
      if (result) {
        const authToken = uuidv4();
        user.authToken = authToken;
        await updateUserProfile(user);
        res.cookie("authToken", authToken);
        res.locals.user = user;
        res.status(HTTP_CREATED).json(user.authToken);
      } else {
        res.locals.user = null;
        res.status(HTTP_CREATED).json(false);
      }
    });
  } catch (error) {
    res.status(HTTP_NOT_FOUND).json(false);
  }
});

//get user details
router.get("/userDetail",verifyAuthenticated, async (req, res) => {
  console.log("userDetail");
  const user = res.locals.user;

  const userDetail = {
    username: user.username,
    email: user.email,
    userId: user._id,
    authToken: user.authToken,
    bookmarks: user.bookmarks,
    notes: user.notes,
    events: user.events,
  };
  if (user) {
    res.status(HTTP_CREATED).json(userDetail);
  } else {
    res.status(HTTP_CREATED).json(false);
  }
});

//log out
router.get("/logout", async (req, res) => {
  console.log("logout");
  res.locals.user = null;
  res.status(HTTP_NO_CONTENT).json(true);
});

export default router;
