import React, { useState, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../AppContextProvider";
import emailjs from "@emailjs/browser";
import { customAlphabet } from "nanoid";
import { notification } from "antd";

// Error Component
const errorMessage = (error) => {
  return (
    <span className="invalid-feedback" style={{ color: "orange" }}>
      {error}
    </span>
  );
};
//Card front -- login component
const Card_front = (props) => {
  //Set the state of the form
  //UseContext to get the state from the Context Provider
  const { authState, setAuthState } = useContext(AppContext);
  const required = "This field is required";
  const maxLength = "Your input exceed maximum length";
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const usernameRef = useRef();
  //Deconstruct the methods from the useForm hook
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  //Handle the onInput event and pass the input value to the state and the parent component with the props's method
  const handleChange = (e) => {
    props.func(e.target.name, e.target.value);
  };
  //Handle the submit event and send ajax request to the backend to authenticate the user
  const onSubmit_front = (data) => {
    const { login_username, login_password } = data;
    axios
      .post("/api/user/login", {
        login_username,
        login_password,
      })
      .then(function (response) {
        // console.log(response.data);
        if (response.data) {
          //if the user is authenticated, set the state of the app to authenticated
          setAuthState({ ...authState, authToken: response.data });
          navigate("/home", { replace: true });
        } else {
          setAuthState({ ...authState, authToken: null });
          setError(true);
        }
      })
      .catch(function (error) {
        // setAuthState({ ...authState,authToken: null });
        console.log(error);
        setError(true);
      });
  };
  //Handle Error
  const onError_front = (data) => {
    console.log("login", data);
  };

  //Send email with a random password to the user
  const sendEmail = (e) => {
    const username = props.login_username;
    if (!username) {
      notification.error({
        message: "Error",
        description: "Please enter a username",
        placement: "bottomRight",
      });
      return;
    }
    axios
      .get(`api/user/checkUsername?username=${username}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.email) {
          emailContent(res.data.email, res.data.username, res.data.id);
        } else {
          notification.error({
            message: "Error",
            description: "No email address found, check your username",
            placement: "bottomRight",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: "Error",
          description: "Error, can not connect to the backend or email server",
          placement: "bottomRight",
        });
      });
  };

  const emailContent = (email, username, id) => {
    //generate a random password
    const nanoid = customAlphabet("1234567890", 8);

    const randomPassword = "Abc" + nanoid();
    const emailServiceId = process.env.REACT_APP_SERVICE_ID_EMAIL;
    const templateId = process.env.REACT_APP_TEMPLATE_ID_EMAIL;
    const publicKey = process.env.REACT_APP_API_KEY_EMAIL;
    const templateParams = {
      from_name: "Your personal start up page",
      message: `Your random password is ${randomPassword}, Please change your password as soon as possible after login`,
      to: email,
    };
    //send email with the random password to the user's email
    emailjs
      .send(emailServiceId, templateId, templateParams, publicKey)
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          notification.success({
            message: "Success",
            description: `A randomPassword has sent to ${email} successfully`,
            placement: "bottomRight",
          });
          updatePassword(email, username, randomPassword, id);
        },
        (error) => {
          console.log("FAILED...", error);
          notification.error({
            message: "Error",
            description: `Failed to send a randomPassword to ${email}`,
            placement: "bottomRight",
          });
        }
      )
      .catch((err) => {
        console.log(err);
        
      });
  };
  //Update the password in the database
  const updatePassword = (email, username, randomPassword, id) => {
    axios
      .post("/api/user/forgetPassword", {
        username,
        email,
        randomPassword,
        id,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          notification.success({
            message: "Success",
            description: `Your password has been changed successfully`,
            placement: "bottomRight",
          });
        } else {
          notification.error({
            message: "Error",
            description: `Failed to change your password`,
            placement: "bottomRight",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: "Error",
          description: `Failed to change your password`,
          placement: "bottomRight",
        });
      });
  };

  return (
    <div className="CardFront">
      <span
        style={{
          display: error || !authState.authToken ? "block" : "none",
          fontSize: "15px",
          color: "orange",
        }}
      >
        {error ? "Error,unable to log in" : ""}
        {!authState.authToken ? "--Authentication Failed" : ""}
      </span>
      <div className="form-group form-group--login">
        <form onSubmit={handleSubmit(onSubmit_front, onError_front)}>
          {errors.login_username?.type === "required" && errorMessage(required)}
          {errors.login_username?.type === "maxLength" &&
            errorMessage(maxLength)}
          <input
            ref={usernameRef}
            className="form-group__input"
            type="text"
            id="username"
            name="login_username"
            placeholder="username"
            onKeyUp={handleChange}
            {...register("login_username", {
              required: true,
              maxLength: 20,
            })}
          />
          {errors.login_password?.type === "required" && errorMessage(required)}
          <input
            className="form-group__input"
            type="password"
            id="password"
            name="login_password"
            placeholder="password"
            onKeyUp={handleChange}
            {...register("login_password", { required: true })}
          />
          <button className="button button--primary full-width" type="submit">
            <span> Log In</span>
          </button>
          <span className="forgetPassword" onClick={sendEmail}>
            Forget your password?
          </span>
        </form>
      </div>
    </div>
  );
};

export default Card_front;
