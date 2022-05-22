import React, { useState, useRef } from "react";
import ReactCardFlip from "react-card-flip";
import CardFront from "./Card_front";
import CardBack from "./Card_back";

const Card = () => {
  //Set the state of the form
  const initialState = {
    isFlipped: false,
    mode: "login",
    login_username: "",
    login_password: "",
    signup_username: "",
    signup_email: "",
    signup_password: "",
    signup_repeatpassword: "",
  };
  const [state, setState] = useState(initialState);

  //To flip the form to signup or login
  const toggleMode = () => {
    setState({
      ...state,
      mode: state.mode === "login" ? "signup" : "login",
      isFlipped: !state.isFlipped,
    });
  };
  //Handle the input event and pass the input value to the state
  const setInputValue = (name, value) => {
    setState({
      ...state,
      [name]: value,
    });
  };
  //Use ref to pass the ref to the children component
  const toggler = useRef({});

  return (
    <section className={`form-block form-block--is-${state.mode}`}>
      <header className="form-block__header">
        <h1>{state.mode === "login" ? "Welcome back!" : "Sign up"}</h1>
        <div className="form-block__toggle-block">
          <span style={{ color: "yellow" }}>
            {state.mode === "login" ? "Don't" : "Already"} have an account?
            &#8594;
          </span>
          <input
            id="form-toggler"
            type="checkbox"
            onClick={toggleMode}
            ref={toggler}
          />
          <label htmlFor="form-toggler"></label>
        </div>
      </header>
      <ReactCardFlip isFlipped={state.isFlipped} flipDirection="horizontal">
        <CardFront {...state} func={setInputValue} />
        <CardBack {...state} func={setInputValue} ref={toggler} />
      </ReactCardFlip>
    </section>
  );
};

export default Card;
