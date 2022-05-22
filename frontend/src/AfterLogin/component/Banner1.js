import React, { useContext, useEffect, useState, useRef } from "react";
import { DownOutlined } from "@ant-design/icons";
import QueueAnim from "rc-queue-anim";
import TweenOne, { TweenOneGroup } from "rc-tween-one";
import BannerAnim, { Element } from "rc-banner-anim";
import { isImg } from "../utils";
import "rc-banner-anim/assets/index.css";
import { AppContext } from "../../AppContextProvider";
import UserProfile from "./userProfile/UserProfile";
import DragList from "./Drag/DragList";
import Weather from "./weather/Weather";
import { CSSTransition } from "react-transition-group";
import CountdownTimer from "./countdownTimer";
import audioURL from "../media/Leapfrog.ogg";

const { BgElement } = Element;

export default function Banner(parentProps) {
  const { authState, setAuthState } = useContext(AppContext);
  //initialize the state
  const [mouseIn, setMouseIn] = useState(false);
  const [mouseIn2, setMouseIn2] = useState(false);
  const [count, setCount] = useState(0);
  const { ...props } = parentProps;
  const { datasource: dataSource } = props;
  const timerIconRef = useRef();
  const userId = authState.userId;
  const audio=new Audio(audioURL);

  //programmatically click the timer icon every time the page is loaded if the user have set any timer so the user be reminded to check the timer
  useEffect(() => {
    let times = JSON.parse(localStorage.getItem("times"))||[];
    times = times.filter((time) => time.userId === userId);
    if (times.length > 0) {
      const timer = setTimeout(() => {
        timerIconRef.current.click();
        return clearTimeout(timer);
      }, 3000);
    }
  }, []);

  //render the banner from the data source
  const childrenToRender = dataSource.BannerAnim.children.map((item, i) => {
    const elem = item.BannerElement;
    const elemClassName = elem.className;
    const { bg, textWrapper, title, content } = item;
    return (
      <Element key={i.toString()} {...elem} prefixCls={elemClassName}>
        <BgElement key="bg" {...bg} />
        <QueueAnim
          type={["bottom", "top"]}
          delay={200}
          key="text"
          {...textWrapper}
        >
          <div key="logo" {...title}>
            {typeof title.children === "string" &&
            title.children.match(isImg) ? (
              <img src={title.children} width="100%" alt="img" />
            ) : title.children === "Your personal calendar" ? (
              title.children
            ) : title.children === "Breaking News Today" ? (
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{title.children}</span>
            ) : (
              title.children + " " + authState.username
            )}
          </div>
          <div key="content" {...content}>
            {content.children}
          </div>
          <CSSTransition
            in={authState.clickUser}
            timeout={5000}
            classNames="alert"
            unmountOnExit
          >
            <UserProfile />
          </CSSTransition>
        </QueueAnim>
      </Element>
    );
  });

  return (
    <div {...props} {...dataSource.wrapper}>
      <DragList />
      <div
        className="weather-icon"
        onClick={() => {
          setMouseIn(!mouseIn);
        }}
      >
        <box-icon
          name="cloud"
          animation="tada-hover"
          color="#eedf12"
        ></box-icon>
      </div>
      {/* add css transition effect */}
      <CSSTransition
        in={mouseIn}
        timeout={5000}
        classNames="alert"
        unmountOnExit
      >
        {/* pass the mouseIn state to the children  */}
        <Weather mouseIn={mouseIn} />
      </CSSTransition>
      {/* Only play the audio once */}
      <div
        className="timer-icon"
        onClick={() => {
          setMouseIn2(!mouseIn2);
          !mouseIn2 && audio.play();
          count>0?audio.pause():audio.play();
          setCount(count + 1);
        }}
        ref={timerIconRef}
      >
        <box-icon
          name="timer"
          animation="tada-hover"
          color="#eedf12"
        ></box-icon>
      </div>
      {/* add css transition effect */}
      <CSSTransition
        in={mouseIn2}
        timeout={5000}
        classNames="alert"
        unmountOnExit
      >
        {/* pass the mouseIn state to the children  */}
        <CountdownTimer mouseIn2={mouseIn2} mouseIn={mouseIn} />
      </CSSTransition>

      <TweenOneGroup
        key="bannerGroup"
        enter={{ opacity: 0, type: "from" }}
        leave={{ opacity: 0 }}
        component=""
      >
        <div className="banner1-wrapper" key="wrapper">
          <BannerAnim
            key="BannerAnim"
            {...dataSource.BannerAnim}
            dragPlay={false}
          >
            {childrenToRender}
          </BannerAnim>
        </div>
      </TweenOneGroup>
      <TweenOne
        animation={{
          y: "-=20",
          yoyo: true,
          repeat: -1,
          duration: 1000,
        }}
        className="banner1-icon"
        style={{ bottom: 40, display: "none" }}
        key="icon"
      >
        <DownOutlined />
      </TweenOne>
    </div>
  );
}
