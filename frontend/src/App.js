import React, { Suspense } from "react";
import routes from "./router/router";
import { useRoutes } from "react-router-dom";
import PreLoader from "./globalComponent/PreLoader";

function App() {
  // Use the useRoutes hook to render the routes
  const elements = useRoutes(routes);

  return (
    <>
      {/* Use the Suspense hook to enable lazy rendering the routes while the page is loading */}
      <Suspense fallback={<PreLoader />}>{elements}</Suspense>
    </>
  );
}

export default App;
