/* eslint no-undef: 0 */
/* eslint arrow-parens: 0 */
import React, { useState, useEffect, useRef } from "react";
import { enquireScreen } from "enquire-js";

import Banner1 from "./component/Banner1";
import Footer2 from "./component/Footer2";

import { Banner10DataSource, Footer20DataSource } from "./data.source";
import "./less/antMotionStyle.less";
let ismobile;
enquireScreen((b) => {
  ismobile = b;
});

//Main component of the login page, template from ant motion

export default function AfterLogin() {
  const initialState = {
    ismobile,
    show: true,
  };
  const [state, setState] = useState(initialState);
  const dom = useRef(null);
  useEffect(() => {}, [state]);
  const children = [
    <Banner1 id="Banner1_0" key="Banner1_0" datasource={Banner10DataSource} />,
    <Footer2 id="Footer2_0" key="Footer2_0" datasource={Footer20DataSource} />,
  ];
  return (
    <div className="templates-wrapper" ref={dom}>
      {state.show && children}
    </div>
  );
}
