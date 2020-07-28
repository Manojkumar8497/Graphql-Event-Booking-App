import React from "react";
import "./EventItem.css";

const eventItem = (props) => (
  <li className="events-list-item">
    <div className="header">
      <h1>{props.event.title}</h1>
      <h2>
        &#8377; {props.event.price} -{" "}
        {new Date(+props.event.createdAt).toLocaleDateString()}
      </h2>
    </div>
    <div className="actions">
      <button
        className="btn"
        onClick={props.onDetail.bind(this, props.event._id)}
      >
        View Details
      </button>
    </div>
  </li>
);

export default eventItem;
