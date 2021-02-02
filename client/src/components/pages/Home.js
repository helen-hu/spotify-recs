import React, { Component } from "react";
import "../../utilities.css";
import "./Home.css";

import { get, post } from "../../utilities";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log(this.props.userId);
    // api calls
  }
  getMe = () => {
    get("/api/getMe").then((data) => {
      console.log(data.body);
    });
  };

  render() {
    return (
      <>
        <h2>home page!</h2>
        <button onClick={this.getMe}>getMe</button>
        {this.props.spotifyId ? (
          <button onClick={this.props.handleLogout}>logout</button>
        ) : (
          <button onClick={this.props.handleLogin}>login</button>
        )}
      </>
    );
  }
}

export default Home;
