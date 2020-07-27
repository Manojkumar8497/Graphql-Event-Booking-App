import React from "react";
import "./EventList.css";

import EventItem from "./EventItem/EventItem";

const eventList = (props) => {
  const events = props.events.map((event) => (
    <EventItem
      event={event}
      key={event._id}
      userId={props.authUserId}
      onDetail={props.onViewDetail}
    />
  ));
  return <ul className="events-list">{events}</ul>;
};

export default eventList;
