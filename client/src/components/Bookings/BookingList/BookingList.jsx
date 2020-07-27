import React from "react";
import "./BookingList.css";

const bookingList = (props) => (
  <ul className="bookings_list">
    {props.bookings.map((booking) => (
      <li className="bookings_item" key={booking._id}>
        <div className="bookings_item_data">
          {booking.event.title} -{" "}
          {new Date(+booking.createdAt).toLocaleDateString()}
        </div>
        <div className="bookings_item_actions">
          <button
            className="btn"
            onClick={props.onCancelBooking.bind(this, booking._id)}
          >
            Cancel
          </button>
        </div>
      </li>
    ))}
  </ul>
);

export default bookingList;
