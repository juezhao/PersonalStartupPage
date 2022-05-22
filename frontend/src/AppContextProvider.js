import React, { useState, useEffect } from "react";
import { getCookie } from "./helper/helper";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AppContext = React.createContext({});

function AppContextProvider({ children }) {
  // The context value that will be supplied to any descendants of this component.
  const initialContextValue = {
    isLoading: false,
    authToken: 1,
    clickUser: false,
    username: "",
    email: "",
    userId: "",
    bookmarks: [],
    notes: [],
    events: [],
    loadingWeather: false,
    closePopup: false,
    timerIcon:null,
  };
  //Initialize the context value
  const [authState, setAuthState] = useState(initialContextValue);
  const context = {
    authState,
    setAuthState,
  };

  //Use the navigate and location hook to navigate to a different routes
  const navigate = useNavigate();
  const location = useLocation();

  //Use the useEffect hook to get the authToken from the cookie when the path changed and set the context value by sending ajax request to backend to retrieve the user's information, if the authToken is not set, redirect to the login page
  useEffect(() => {
    const authToken = getCookie("authToken");
    if (authToken) {
      setAuthState({
        ...authState,
        isLoading: true,
      });
      axios
        .get("/api/user/userDetail")
        .then(function (response) {
          setAuthState({ ...authState, ...response.data, isLoading: false });
          localStorage.setItem("userId", response.data.userId);
        })
        .catch(function (error) {
          console.log(error);
        });

      if (
        location.pathname === "/" ||
        location.pathname === "/home" ||
        location.pathname === "/login" ||
        location.pathname === "/logout"
      ) {
        navigate("/home", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [location.pathname, authState.clickUser]);

  // Wraps the given child components in a Provider for the above context.
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

export { AppContext, AppContextProvider };
