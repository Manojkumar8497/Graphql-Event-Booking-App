import React, { Component } from "react";

import AuthContext from "../context/context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList/BookingList";

class Bookings extends Component {
  state = {
    isLoading: false,
    bookings: [],
  };
  static contextType = AuthContext;
  componentDidMount() {
    this.fetchBookings();
  }
  fetchBookings = () => {
    this.setState({ isLoading: true });
    // Send the req to backend
    const requestBody = {
      query: `
          query{
            bookings{
              _id
              createdAt
              event{
                _id,
                title,
                createdAt
              }
            }
          }
        `,
    };
    // Fetch request
    fetch("http://localhost:8000/api/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        this.setState({ bookings: resData.data.bookings, isLoading: false });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };
  // Cancel Booking
  cancelBookingHandler = (bookingId) => {
    this.setState({ isLoading: true });
    // Send the req to backend
    const requestBody = {
      query: `
          mutation{
            cancelBooking(bookingId:"${bookingId}"){
              _id
            }
          }
        `,
    };
    fetch("http://localhost:8000/api/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        this.setState((prevState) => {
          const updatedBookings = prevState.bookings.filter(
            (booking) => booking._id !== bookingId
          );
          return { bookings: updatedBookings, isLoading: false };
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };
  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <BookingList
            bookings={this.state.bookings}
            onCancelBooking={this.cancelBookingHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Bookings;
