import React, { useRef, useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { AppContext } from "../../../AppContextProvider";
import "boxicons";
// Error Component
const errorMessage = (error) => {
  return (
    <span
      className="invalid-feedback"
      style={{ color: "orange", float: "left" }}
    >
      {error}
    </span>
  );
};

const UserProfile = () => {
  //get the context from the provider
  const { authState, setAuthState } = useContext(AppContext);
  //Set the state for the form
  const [accountUpdated, setAccountUpdated] = useState(false);
  const [error, setError] = useState(false);
  const [existing_username, setExisting_username] = useState("");
  const [existing_email, setExisting_email] = useState("");
  const [existing_password, setExisting_password] = useState("");
  const buttonRef = useRef();
  const required = "This field is required";
  const maxLength = "Your input exceed maximum length";
  //Deconstruct the method from the hook
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();
  //check if username and email are already taken exclude the current user's username and email
  const checkUsername = (e) => {
    const username = e.target.value;
    axios
      .get(`api/user/checkUpdatedUsername?username=${username}`)
      .then((res) => {
        // console.log(res.data);
        if (res.data) {
          setExisting_username(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const checkEmail = (e) => {
    const email = e.target.value;
    axios
      .get(`api/user/checkUpdatedEmail?email=${email}`)
      .then((res) => {
        // console.log(res.data);
        if (res.data) {
          setExisting_email(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const checkOldPassword = (e) => {
    const old_password = e.target.value;
    axios
      .post(`api/user/checkOldPassword?`, { old_password })
      .then((res) => {
        if (res.data) {
          setExisting_password(true);
          buttonRef.current.click();
        } else {
          setExisting_password(false);
          buttonRef.current.click();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //handle input change and set the state back to context provider
  const handleChange = (e) => {
    e.preventDefault();
    setAuthState({ ...authState, [e.target.name]: e.target.value });
  };

  //handle the form submit and send ajax request to update the user's profile
  const onSubmit_back = (data, e) => {
    const { username, email, repeatpassword } = data;
    axios
      .post("/api/user/updateUser", {
        username,
        email,
        repeatpassword,
      })
      .then(function (response) {
        setAccountUpdated(true);
        const timer = setTimeout(() => {
          //when success, reset the from and hide the component
          e.target.reset();
          setAuthState({ ...authState, clickUser: false });
          return clearTimeout(timer);
        }, 1500);
      })
      .catch(function (e) {
        console.log(e);
        setAccountUpdated(false);
        setError(true);
      });
  };
  //handle error
  const onError_back = (data) => {
    console.log("update", data);
  };
  //Use ref to watch the the input value of password
  const password = useRef({});
  password.current = watch("update_password", "");
  return (
    <div className="CardBack userProfile">
      <box-icon
        name="x"
        animation="tada"
        color="#d4ea2e"
        style={{ float: "right", cursor: "pointer" }}
        onClick={() => setAuthState({ ...authState, clickUser: false })}
      ></box-icon>
      <h2 style={{ color: "white" }}>Edit Profile</h2>
      <span
        style={{
          display: accountUpdated ? "block" : error ? "block" : "none",
          fontSize: "15px",
          color: "orange",
        }}
      >
        {accountUpdated
          ? "Account successfully updated"
          : error
          ? "Error,unable to update account"
          : ""}
      </span>
      <div className="form-group form-group--signup">
        <form onSubmit={handleSubmit(onSubmit_back, onError_back)}>
          {errors.username?.type === "required" && errorMessage(required)}
          {errors.username?.type === "maxLength" && errorMessage(maxLength)}
          {errors.username?.type === "validate" &&
            errorMessage(errors.username.message)}
          <input
            className="form-group__input"
            // type="text"
            id="fullname"
            name="username"
            placeholder="username"
            onInput={(e) => {
              handleChange(e);
              checkUsername(e);
            }}
            value={authState.username}
            {...register("username", {
              required: true,
              maxLength: 20,
              validate: (value) => {
                return existing_username !== value || "Username already exists";
              },
            })}
          />
          {errors.email?.type === "required" && errorMessage(required)}
          {errors.email?.type === "pattern" && errorMessage("Invalid email")}
          {errors.email?.type === "validate" &&
            errorMessage("Email already exists")}
          <input
            className="form-group__input"
            type="email"
            id="email"
            name="email"
            placeholder="email"
            onInput={(e) => {
              checkEmail(e);
              handleChange(e);
            }}
            value={authState.email}
            {...register("email", {
              required: true,
              pattern: /^\S+@\S+$/i,
              validate: (value) => {
                return existing_email !== value;
              },
            })}
          />
          {errors.old_password?.type === "required" && errorMessage(required)}
          {errors.old_password?.type === "validate" &&
            errorMessage("Incorrect password")}
          <input
            className="form-group__input"
            type="password"
            id="old_password"
            name="old_password"
            placeholder="Old password"
            onInput={(e) => {
              checkOldPassword(e);
            }}
            {...register("old_password", {
              required: true,
              validate: () => {
                return existing_password;
              },
            })}
          />
          {errors.update_password?.type === "required" &&
            errorMessage(required)}
          {errors.update_password?.type === "pattern" &&
            errorMessage("At least one letter one number,8 characters")}
          <input
            className="form-group__input"
            type="password"
            id="createpassword"
            name="update_password"
            placeholder="New password"
            {...register("update_password", {
              required: true,
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
              },
            })}
          />
          {errors.repeatpassword?.type === "required" && errorMessage(required)}
          {errors.repeatpassword?.type === "validate" &&
            errorMessage("The passwords do not match")}
          <input
            className="form-group__input"
            type="password"
            id="repeatpassword"
            name="repeatpassword"
            placeholder="repeat password"
            {...register("repeatpassword", {
              required: true,
              validate: (value) => value === password.current,
            })}
          />
          <button
            className="button button--primary full-width"
            type="submit"
            ref={buttonRef}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};
export default UserProfile;
