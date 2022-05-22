import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function PageNotFound() {
  //use the location to get the pathname
  const location = useLocation();
  return (
    <div id="pageNotFound_container">
      <div className="content">
        <h2>404</h2>
        <h4>Opps! Page not found</h4>
        <p>
          The page <span style={{ color: "red" }}>{location.pathname}</span> you
          were looking for doesn't exist. You may have mistyped the address or
          the page may have moved
        </p>
        <Link to="/home">Back To Home</Link>
      </div>
    </div>
  );
}
