import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import Home from "./pages/Home.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      // userId: null,
      spotifyId: null,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user.spotifyId) {
        // they are registed in the database, and currently logged in.
        this.setState({
          // userId: user._id,
          spotifyId: user.spotifyId,
        });
      }
    });
  }

  handleLogin = () => {
    get("/api/spotifyLogin").then((data) => {
      console.log(data);
      window.location.href = data.url;
    });
  };

  handleLogout = () => {
    this.setState({
      // userId: null,
      spotifyId: null,
    });
    console.log("logging out");
    post("/api/logout");
  };

  render() {
    return (
      <>
        <Router>
          {/* <Skeleton
            path="/skeleton"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          /> */}
          <Home
            path="/"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            spotifyId={this.state.spotifyId}
          />
          <NotFound default />
        </Router>
      </>
    );
  }
}

export default App;
