import React, { forwardRef, useRef, useState } from "react";

//Use react-hook-form to validate form input
import { useForm } from "react-hook-form";
import axios from "axios";

// Error Component
const errorMessage = (error) => {
  return (
    <span className="invalid-feedback" style={{ color: "orange" }}>
      {error}
    </span>
  );
};
//Card Back--signup component, use forwardRef to get the ref and props from the parent component
const Card_back = forwardRef((props, ref) => {
  //Set the state of the form
  const [accountCreated, setAccountCreated] = useState(false);
  const [error, setError] = useState(false);
  const [existing_username, setExisting_username] = useState("");
  const [existing_email, setExisting_email] = useState("");
  const required = "This field is required";
  const maxLength = "Your input exceed maximum length";

  //Deconstruct the methods from the useForm hook
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();
  //Handle the onInput event and pass the input value to the state and the parent component with the props's method
  const handleChange = (e) => {
    props.func(e.target.name, e.target.value);
  };

  //Check if the username or email is already taken and set the state
  const checkUsername = (e) => {
    const username = e.target.value;
    axios
      .get(`api/user/checkUsername?username=${username}`)
      .then((res) => {
        // console.log(res.data);
        if (res.data) {
          setExisting_username(res.data.username);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const checkEmail = (e) => {
    const email = e.target.value;
    axios
      .get(`api/user/checkEmail?email=${email}`)
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
  //Handle the submit event and send ajax request to the backend to create a new user
  const onSubmit_back = (data, e) => {
    const { signup_username, signup_email, signup_repeatpassword } = data;
    axios
      .post("/api/user/register", {
        signup_username,
        signup_email,
        signup_repeatpassword,
      })
      .then(function (response) {
        // console.log(response.data);
        setAccountCreated(true);
        setError(false);
        const timer = setTimeout(() => {
          setAccountCreated(false);
          e.target.reset();
          //Programmatically click the toggle button
          ref.current.click();
          return clearTimeout(timer);
        }, 1500);
      })
      .catch(function (error) {
        // console.log(e);
        setAccountCreated(false);
        setError(true);
        console.log(error);
      });
  };
  //Handle Error
  const onError_back = (data) => {
    console.log("signup-error", data);
  };
  //Use the ref to get the ref and watch the input value
  const password = useRef({});
  password.current = watch("signup_password", "");
  return (
    <div className="CardBack">
      <span
        style={{
          display: accountCreated || error ? "block" : "none",
          fontSize: "15px",
          color: "orange",
        }}
      >
        {accountCreated
          ? "Account successfully created"
          : error
          ? "Error,unable to create account"
          : ""}
      </span>
      <div className="form-group form-group--signup">
        <form onSubmit={handleSubmit(onSubmit_back, onError_back)}>
          {errors.signup_username?.type === "required" &&
            errorMessage(required)}
          {errors.signup_username?.type === "maxLength" &&
            errorMessage(maxLength)}
          {errors.signup_username?.type === "validate" &&
            errorMessage("Username already taken")}
          <input
            className="form-group__input"
            type="text"
            id="fullname"
            name="signup_username"
            placeholder="username"
            onKeyUp={(e) => {
              handleChange(e);
              checkUsername(e);
            }}
            {...register("signup_username", {
              required: true,
              maxLength: 20,
              validate: (value) => {
                return existing_username !== value;
              },
            })}
          />
          {errors.signup_email?.type === "required" && errorMessage(required)}
          {errors.signup_email?.type === "pattern" &&
            errorMessage("Not a valid email")}
          {errors.signup_email?.type === "validate" &&
            errorMessage("Email already taken")}
          <input
            className="form-group__input"
            type="email"
            id="email"
            name="signup_email"
            placeholder="email"
            onKeyUp={(e) => {
              handleChange(e);
              checkEmail(e);
            }}
            {...register("signup_email", {
              required: true,
              pattern: /^\S+@\S+$/i,
              validate: (value) => {
                return existing_email !== value;
              },
            })}
          />
          {errors.signup_password?.type === "required" &&
            errorMessage(required)}
          {errors.signup_password?.type === "pattern" &&
            errorMessage('"At least one letter one number,8 characters"')}
          <input
            className="form-group__input"
            type="password"
            id="createpassword"
            name="signup_password"
            placeholder="password"
            onKeyUp={handleChange}
            {...register("signup_password", {
              required: true,
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            })}
          />
          {errors.signup_repeatpassword?.type === "required" &&
            errorMessage(required)}
          {errors.signup_repeatpassword?.type === "validate" &&
            errorMessage("The passwords do not match")}
          <input
            className="form-group__input"
            type="password"
            id="repeatpassword"
            name="signup_repeatpassword"
            placeholder="repeat password"
            onKeyUp={handleChange}
            {...register("signup_repeatpassword", {
              required: true,
              validate: (value) => value === password.current,
            })}
          />
          <button className="button button--primary full-width" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
});
export default Card_back;
