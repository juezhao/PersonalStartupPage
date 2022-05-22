/* eslint no-undef: 0 */
/* eslint arrow-parens: 0 */
import React, { useState, useEffect, useRef } from "react";
import { enquireScreen } from "enquire-js";

import Banner2 from "./component/Banner2";

import { Banner20DataSource } from "./data.source";
import "./less/antMotionStyle.less";
import {deleteCookie} from '../helper/helper';

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

//Main component of the login page, template from ant design motion
export default function Home() {
  const initialState = {
    isMobile,
    show: true,
  };
  const [state, setState] = useState(initialState);
  const dom = useRef(null);
  const children = [
    <Banner2
      id="Banner2_0"
      key="Banner2_0"
      datasource={Banner20DataSource}
      ismobile={state.isMobile}
    />,
  ];
  //Make sure the authToken does not exist in the login page, if it does, delete it
  useEffect(() => {
    localStorage.removeItem('userId');
    deleteCookie('authToken');
  }, [state]);

  return (
    <div className="templates-wrapper" ref={dom}>
      {state.show && children}
    </div>
  );
}
