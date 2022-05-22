import React, { useEffect, useState } from "react";
import Scheduler from "./Scheduler";

const initialEvents = {
  id: 123456,
  text: "Use double click or drag to create event, note that this is a test data and is not saved to database",
  start_date: "2022-05-20 03:00",
  end_date: "2022-05-20 06:00",
  evType: "2",
};
const Calendar = (props) => {
  const [events, setEvents] = React.useState([initialEvents]);
 

  useEffect(() => {
    console.log("Calendar mounted");

    logDataUpdate();
  }, []);
  //log data update and pass to scheduler
  const logDataUpdate = (action, ev, id) => {
    const text = ev && ev.text ? ` (${ev.text})` : "";
    // console.log(`${action} event ${id}${text},`);
  };
  return (
    <div>
      <div className="scheduler-container">
        <Scheduler events={events} onDataUpdated={logDataUpdate} />
      </div>
    </div>
  );
};
export default Calendar;
