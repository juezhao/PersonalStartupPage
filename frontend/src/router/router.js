import { lazy } from "react";
// Lazy-load components
const Login = lazy(() => import("../Login"));
const AfterLogin = lazy(() => import("../AfterLogin"));
const PageNotFound = lazy(() => import("../globalComponent/PageNotFound"));

//Routes for the application
const routes = [
  { path: "/login", element: <Login />, replace: true },
  { path: "/home", element: <AfterLogin /> },
  { path: "/home/*", element: <AfterLogin />, },
  {
    path: "/",
    element: <AfterLogin />,
  },
  { path: "/logout", element: <Login /> },
  { path: "*", element: <PageNotFound /> },
];
export default routes;
