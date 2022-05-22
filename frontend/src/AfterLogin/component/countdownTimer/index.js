import React, { useEffect, useState, useRef, useContext } from "react";
import "boxicons";
import Countdown from "react-countdown";
import { AppContext } from "../../../AppContextProvider";
import { notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";

// Component for completing the countdown
const Completionist = () => {
  return <div className="animated-letter">YOUR BIG DAY!</div>;
};

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a complete state

    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <div style={{ color: "#fff", fontSize: "20px" }}>
        {days} days : {hours} hours
      </div>
    );
  }
};

//Timer component
const EachTimer = ({ times, onRemoveTimer }) => {
  const { authState, setAuthState } = useContext(AppContext);
  const userId = authState.userId;
  const dateTomilliseconds = (date) => new Date(date).getTime() - 43200000;
  //Store the date to local storage
  localStorage.setItem("times", JSON.stringify(times));
  //select the user's times
  times = times.filter((time) => time.userId === userId);

  //render the timer component with condition
  return (
    <>
      {times && times.length > 0 ? (
        times.map((time, index) => (
          <div className="eachTimer" key={index} id={index}>
            <div className="timer">
              <span style={{ color: "yellow" }}>Time until {time.date}</span>
              <box-icon
                name="x-circle"
                animation="tada-hover"
                color="#ebe646"
                style={{
                  float: "right",
                  cursor: "pointer",
                  opacity: "0",
                  transition: "all 0.5s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = "1";
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = "0";
                }}
                onClick={() => {
                  onRemoveTimer(index);
                }}
              ></box-icon>
              <Countdown
                date={dateTomilliseconds(time.date)}
                renderer={renderer}
              />
            </div>
          </div>
        ))
      ) : (
        <p>Choose a future day to countdown.To delete a timer, hover to its right side and a delete icon will appear</p>
      )}
    </>
  );
};

//The whole countdown timer component
export default function CountdownTimer({ mouseIn2, mouseIn }) {
  //get the data from the local storage or the default data
  const initialTimes = JSON.parse(localStorage.getItem("times")) || [];
  //store the data in the state
  const [times, setTimes] = useState(initialTimes);
  const timerRef = useRef();
  const { authState, setAuthState } = useContext(AppContext);
  const userId = authState.userId;
  const titleRef = useRef();

  //animate the the component when the mouse click on weather or timer icons
  useEffect(() => {
    if (
      timerRef.current &&
      mouseIn === mouseIn2 &&
      authState.loadingWeather === false
    ) {
      timerRef.current.style.top = "318px";
    } else {
      timerRef.current.style.top = "75px";
    }
  }, [mouseIn, mouseIn2, authState.loadingWeather]);

  //Check if the user enter a future day, if yes, add timer to the state and store the data in the local storage
  const addTime = (e) => {
    const date = e.target.value;
    if (new Date(date).getTime() - 43200000 > Date.now()) {
      setTimes([...times, { date, userId }]);
      notification.success({
        message: "Success",
        description: "Timer added successfully",
        placement: "bottomLeft",
        duration: 2,
        icon: <SmileOutlined />,
      });
    } else {
      notification.open({
        message: "Invalid date",
        description: "Please choose a future day...",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        duration: 2,
        placement: "bottomLeft",
      });
    }
  };

  return (
    <>
      <div
        className="countdownTimer-container"
        ref={timerRef}
        style={{ display: mouseIn2 ? "block" : "none" }}
      >
        <div style={{ position: "relative" }}>
          <input
            type="date"
            onChange={addTime}
            className="timerTime"
            onMouseOver={(e) => {
              titleRef.current.style.display = "none";
            }}
            onMouseOut={(e) => {
              titleRef.current.style.display = "block";
            }}
          />
          <h4
            style={{ position: "absolute", top: "15px", left: "80px" }}
            className="timerTitle"
            ref={titleRef}
          >
            YOUR TIMER
          </h4>
        </div>

        <EachTimer
          times={times}
          // remove the timer from the state and store the data in the local storage
          onRemoveTimer={(index) => {
            times.splice(index, 1);
            setTimes([...times]);
            localStorage.setItem("times", JSON.stringify(times));
          }}
        />
      </div>
    </>
  );
}
