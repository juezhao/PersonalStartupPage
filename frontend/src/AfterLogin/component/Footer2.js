import React, { useContext } from "react";
import TweenOne from "rc-tween-one";
import OverPack from "rc-scroll-anim/lib/ScrollOverPack";
import { isImg } from "../utils";
import "boxicons";
import { AppContext } from "../../AppContextProvider";
import { deleteCookie } from "../../helper/helper";
import axios from "axios";
import { notification } from "antd";

//footer component
export default function Footer2(parentProps) {
  //get the context from the provider
  const { authState, setAuthState } = useContext(AppContext);

  //receive the props from the parent component
  const { ...props } = parentProps;
  const { datasource: dataSource } = props;

  //Handle button click on different buttons
  const handleButtonClick = (item) => {
    if (item.name === "userProfile") {
      //if the userProfile is clicked, show the user profile component
      setAuthState({ ...authState, clickUser: !authState.clickUser });
    } else if (item.name === "logout") {
      //if the logout is clicked, delete the cookie and userId, and send ajax request to backend to clear local user
      deleteCookie("authToken");
      localStorage.removeItem("userId");
      setAuthState({ ...authState, authToken: null, clickUser: false });
      axios
        .get("/api/user/logout")
        .then(function (response) {
          // console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
          notification.error({
            message: "Error",
            description: "Error, can not connect to server",
            placement: "bottomRight",
          });
        });
    }
  };
  return (
    <div {...props} {...dataSource.wrapper}>
      <OverPack {...dataSource.OverPack}>
        <TweenOne {...dataSource.links}>
          {dataSource.links.children.map((item, i) => {
            return (
              <a
                key={i.toString()}
                {...item}
                onClick={() => handleButtonClick(item)}
              >
                {item.children}
              </a>
            );
          })}
        </TweenOne>
        <TweenOne
          animation={{ x: "+=30", opacity: 0, type: "from" }}
          key="copyright"
          {...dataSource.copyright}
        >
          {dataSource.copyright.children.map((item, i) =>
            React.createElement(
              item.name.indexOf("title") === 0 ? "h1" : "div",
              { key: i.toString(), ...item },
              typeof item.children === "string" && item.children.match(isImg)
                ? React.createElement("img", {
                    src: item.children,
                    alt: "img",
                  })
                : item.children
            )
          )}
        </TweenOne>
      </OverPack>
    </div>
  );
}
