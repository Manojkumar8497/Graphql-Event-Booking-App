import React, { Component } from "react";

import AuthContext from "../context/context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingsChart from "../components/Bookings/BookingsChart/BookingsChart";
import BookingsControl from "../components/Bookings/BookingsControl/BookingsControl";

class Bookings extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: "list",
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
                price,
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
          mutation CancelBooking($id:ID!){
            cancelBooking(bookingId:$id){
              _id
            }
          }
        `,
      variables: {
        id: bookingId,
      },
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

  changeOutputHandler = (outputType) => {
    if (outputType === "list") {
      this.setState({ outputType: "list" });
    } else {
      this.setState({ outputType: "chart" });
    }
  };

  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          <BookingsControl
            onChange={this.changeOutputHandler}
            activeOutputType={this.state.outputType}
          />
          <div>
            {this.state.outputType === "list" ? (
              this.state.bookings.length > 0 ? (
                <BookingList
                  bookings={this.state.bookings}
                  onCancelBooking={this.cancelBookingHandler}
                />
              ) : (
                <p className="text-center">
                  You didn't booked any event yet :(
                </p>
              )
            ) : this.state.bookings.length > 0 ? (
              <BookingsChart bookings={this.state.bookings} />
            ) : (
              <p className="text-center">Book events to see the chart :(</p>
            )}
          </div>
        </React.Fragment>
      );
    }
    return <React.Fragment>{content}</React.Fragment>;
  }
}

export default Bookings;
