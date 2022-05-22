import React, { useRef, useCallback, useEffect, useState } from "react";
import "dhtmlx-scheduler";
import "dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css";
import "dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_tooltip.js";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { notification } from "antd";

const scheduler = window.scheduler;

const Scheduler = (props) => {
  //initialize scheduler config

  const { events } = props;
  const [eventsState, setEventsState] = useState(events);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  scheduler.skin = "material";
  scheduler.config.header = [
    "day",
    "week",
    "month",
    "date",
    "prev",
    "today",
    "next",
  ];
  scheduler.config.hour_date = "%g:%i %A";
  scheduler.xy.scale_width = 70;
  scheduler.config.details_on_create = true;
  //get events from database and set to scheduler when component mounted
  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/event/getEvents")
      .then((res) => {
        res.data.forEach((event) => {
          events.push({
            id: event._id,
            text: event.text,
            start_date: event.startDateTime,
            end_date: event.endDateTime,
            evType: event.evType,
          });
        });
        setEventsState([...events]);
        initSchedulerEvents();
        scheduler.init(schedulerContainer.current, new Date(), "month");
        scheduler.clearAll();
        scheduler.parse(eventsState);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError(true);
      });
  }, []);

  const schedulerContainer = useRef();
  //initialize scheduler events, including adding, updating, and deleting events
  const initSchedulerEvents = useCallback(() => {
    if (scheduler._$initialized) {
      return;
    }
    //customize scheduler event type
    const evType = [
      { key: "2", label: "False" },
      { key: "1", label: "True" },
    ];
    scheduler.locale.labels.section_evType = "Completion";

    scheduler.config.lightbox.sections = [
      {
        name: "description",
        height: 43,
        map_to: "text",
        type: "textarea",
        focus: true,
      },
      {
        name: "evType",
        height: 20,
        type: "select",
        options: evType,
        map_to: "evType",
      },
      { name: "time", height: 72, type: "time", map_to: "auto" },
    ];
    scheduler.templates.event_class = function (start, end, event) {
      let css = "";

      if (event.evType && getLabel(evType, event.evType)) {
        css += "event_" + getLabel(evType, event.evType).toLowerCase();
        return css; // default return
      }
      // if event has type property then special class should be assigned
    };

    function getLabel(array, key) {
      for (let i = 0; i < array.length; i++) {
        if (key === array[i].key) return array[i].label;
      }
      return null;
    }

    const onDataUpdated = props.onDataUpdated;

    //adding event
    scheduler.attachEvent("onEventAdded", (id, ev) => {
      if (onDataUpdated) {
        onDataUpdated("create", ev, id);
        axios
          .post("/api/event/createEvent", ev)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
            notification.error({
              message: "Error",
              description: "Error, can not connect to server",
              placement: "bottomRight",
            });
          });
      }
    });
    //updating event
    scheduler.attachEvent("onEventChanged", (id, ev) => {
      if (onDataUpdated) {
        onDataUpdated("update", ev, id);
        axios
          .post("/api/event/updateEvent", ev)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
            notification.error({
              message: "Error",
              description: "Error, can not connect to server",
              placement: "bottomRight",
            });
          });
      }
    });
    //deleting event
    scheduler.attachEvent("onEventDeleted", (id, ev) => {
      if (onDataUpdated) {
        onDataUpdated("delete", ev, id);
        axios
          .post("/api/event/deleteEvent", ev)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
            notification.error({
              message: "Error",
              description: "Error, can not connect to server",
              placement: "bottomRight",
            });
          });
      }
    });
    scheduler._$initialized = true;
  });

  return (
    <>
      {loading ? <RotatingLines width="100" strokeColor="#FF5733" /> : null}
      {error ? <div>Error....Can not load the events!</div> : null}
      <div
        ref={(input) => {
          schedulerContainer.current = input;
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      ></div>
    </>
  );
};

export default Scheduler;
