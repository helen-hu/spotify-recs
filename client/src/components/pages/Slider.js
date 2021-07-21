import React, { Component } from "react";
import "../../utilities.css";
import "./Slider.css";

import { get, post } from "../../utilities";

/**
 * Proptypes
 * @param {Function} sliderCallback
 * @param {String} sliderName
 * @param {String} sliderMin
 * @param {String} sliderMax
 */
class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = (event) => {
    alert("A value was submitted: " + this.state.value);
    this.props.sliderCallback(this.props.sliderName, this.state.value);
    event.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor={this.props.sliderName}>
          {this.props.sliderName}
          <input
            type="range"
            id={this.props.sliderName}
            name={this.props.sliderName}
            min={this.props.sliderMin}
            max={this.props.sliderMax}
            onChange={this.handleChange}
          />
        </label>
        <output htmlFor={this.props.sliderName}>{this.state.value}</output>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default Slider;
