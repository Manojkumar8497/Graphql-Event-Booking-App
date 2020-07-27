import React, { Component } from "react";
import "./Events.css";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";

class Events extends Component {
  state = {
    isCreateEvent: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
  };
  isActive = true;
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.titleEl = React.createRef();
    this.descriptionEl = React.createRef();
    this.priceEl = React.createRef();
  }
  componentDidMount() {
    this.fetchEvents();
  }
  startCreateEventHandler = () => {
    this.setState({ isCreateEvent: true });
  };
  onModalCancelHandler = () =>
    this.setState({ isCreateEvent: false, selectedEvent: null });
  onModalConfirmHandler = () => {
    this.setState({ isCreateEvent: false });
    const title = this.titleEl.current.value;
    const description = this.descriptionEl.current.value;
    const price = +this.priceEl.current.value;
    if (!title.trim().length || !description.trim().length || !price) {
      return;
    }
    // Send the req to backend
    const requestBody = {
      query: `
        mutation{
          createEvent(eventInput:{title:"${title}",description:"${description}",price:${price}}){
            _id
            title
            description
            price
            creator{
              _id
              email
            }
            createdAt
          }
        }
      `,
    };

    const token = this.context.token;
    // Fetch request
    fetch("http://localhost:8000/api/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
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
          const updatedEvents = [...prevState.events];
          updatedEvents.push(resData.data.createEvent);
          return { events: updatedEvents };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  fetchEvents = () => {
    this.setState({ isLoading: true });
    // Send the req to backend
    const requestBody = {
      query: `
        query{
          events{
            _id
            title
            description
            price
            creator{
              _id
              email
            }
            createdAt
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
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        if (this.isActive) {
          this.setState({ events, isLoading: false });
        }
      })
      .catch((err) => {
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
        console.log(err);
      });
  };
  ShowDetailHandler = (eventId) => {
    this.setState((prevState) => {
      const selectedEvent = prevState.events.find(
        (event) => event._id === eventId
      );
      return { selectedEvent };
    });
  };
  onBookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      this.props.history.push("/auth");
      return;
    }
    // Send the req to backend
    const requestBody = {
      query: `
          mutation{
            bookEvent(eventId:"${this.state.selectedEvent._id}"){
              _id
              createdAt
              updatedAt
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
        this.setState({ selectedEvent: null });
        console.log(resData);
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };
  componentWillUnmount() {
    this.isActive = false;
  }
  render() {
    return (
      <React.Fragment>
        {this.state.isCreateEvent && (
          <React.Fragment>
            <Backdrop />
            <Modal
              title="Create Event"
              isCancel
              isConfirm
              onCancel={this.onModalCancelHandler}
              onConfirm={this.onModalConfirmHandler}
              confirmText="Confirm"
            >
              <form>
                <div className="form-control">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" ref={this.titleEl} />
                </div>
                <div className="form-control">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    rows="2"
                    ref={this.descriptionEl}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input type="number" id="price" ref={this.priceEl} />
                </div>
              </form>
            </Modal>
          </React.Fragment>
        )}
        {this.state.selectedEvent && (
          <React.Fragment>
            <Backdrop />
            <Modal
              title={this.state.selectedEvent.title}
              isCancel
              isConfirm
              onCancel={this.onModalCancelHandler}
              onConfirm={this.onBookEventHandler}
              confirmText={this.context.token ? "Book" : "Login to Book"}
            >
              <h1>{this.state.selectedEvent.title}</h1>
              <h2>
                &#8377; {this.state.selectedEvent.price} -{" "}
                {new Date(
                  +this.state.selectedEvent.createdAt
                ).toLocaleDateString()}
              </h2>
              <p>{this.state.selectedEvent.description}</p>
            </Modal>
          </React.Fragment>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : this.state.events.length > 0 ? (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.ShowDetailHandler}
          />
        ) : (
          <p className="text-center">Events are not posted yet:(</p>
        )}
      </React.Fragment>
    );
  }
}

export default Events;
