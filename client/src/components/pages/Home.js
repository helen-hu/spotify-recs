import React, { Component } from "react";
import "../../utilities.css";
import "./Home.css";

import { get, post } from "../../utilities";

/**
 * Proptypes
 * @param {Function} handleLogin
 * @param {Function} handleLogout
 * @param {String} spotifyId
 * @param {Array} genreSeeds
 */
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seeds: {
        limit: 20,
        // market: null,
        seed_artists: ["3Nrfpe0tUJi4K4DXYWgMUX"],
        // seed_genres: [],
        // seed_tracks: [],
        // min_acousticness: 0,
        // max_acousticness: null,
        // target_acousticness: null,
        // min_danceability: null,
        // max_danceability: null,
        // target_danceability: null,
        // min_duration_ms: null,
        // max_duration_ms: null,
        // target_duration_ms: null,
        // min_energy: 0.4,
        // max_energy: null,
        // target_energy: null,
        // min_instrumentalness: null,
        // max_instrumentalness: null,
        // target_instrumentalness: null,
        // min_key: null,
        // max_key: null,
        // target_key: null,
        // min_liveness: null,
        // max_liveness: null,
        // target_liveness: null,
        // min_loudness: null,
        // max_loudness: null,
        // target_loudness: null,
        // min_mode: null,
        // max_mode: null,
        // target_mode: null,
        // min_popularity: 50,
        // max_popularity: null,
        // target_popularity: null,
        // min_speechiness: null,
        // max_speechiness: null,
        // target_speechiness: null,
        // min_tempo: null,
        // max_tempo: null,
        // target_tempo: null,
        // min_time_signature: null,
        // max_time_signature: null,
        // target_time_signature: null,
        // min_valence: null,
        // max_valence: null,
        // target_valence: null,
      },
      recs: [],
    };
  }

  componentDidMount() {}

  getMe = () => {
    get("/api/getMe").then((data) => {
      console.log(data.body);
    });
  };

  getGenreSeeds = () => {
    console.log(this.props.genreSeeds);
  };

  getRecs = () => {
    get("/api/getRecs", this.state.seeds).then((data) => {
      const seeds = data.seeds;
      const tracks = data.tracks;
      console.log(tracks);
      this.setState({
        recs: tracks,
      });
    });
  };

  render() {
    return (
      <>
        <div className="Home-header">
          <h2>home page!</h2>
          {this.props.spotifyId ? (
            <>
              <button onClick={this.getMe}>getMe</button>
              <button onClick={this.props.handleLogout}>logout</button>
            </>
          ) : (
            <button onClick={this.props.handleLogin}>login</button>
          )}
        </div>

        <div className="Home-container">
          <div className="Home-formContainer">
            <h3>form</h3>
            <button onClick={this.getGenreSeeds}>get genre seeds</button>
            <button onClick={this.getRecs}>get recommendations</button>
          </div>

          <div className="Home-trackContainer">
            <h3>ur tracks</h3>
            {this.state.recs.map((track) => {
              return <div key={track.id}>{track.name}</div>;
            })}
          </div>
        </div>
      </>
    );
  }
}

export default Home;
