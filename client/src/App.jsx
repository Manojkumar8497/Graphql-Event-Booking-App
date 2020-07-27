import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";

// Pages
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";

// Components
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/context";

class App extends Component {
  state = {
    token: null,
    userId: null,
  };
  logIn = (token, userId, tokenExpiration) => {
    this.setState({ token, userId });
  };
  logOut = () => {
    this.setState({ token: null, userId: null });
  };
  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.logIn,
            logOut: this.logOut,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {this.state.token && <Redirect from="/" to="/events" exact />}
              {this.state.token && <Redirect from="/auth" to="/events" exact />}
              {!this.state.token && <Route path="/auth" component={Auth} />}
              <Route path="/events" component={Events} />
              {this.state.token && (
                <Route path="/bookings" component={Bookings} />
              )}
              {!this.state.token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
