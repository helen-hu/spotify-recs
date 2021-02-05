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
      },
      acousticness: {
        // min_acousticness: 0,
        // max_acousticness: null,
        // target_acousticness: null,
      },
      danceability: {
        // min_danceability: null,
        // max_danceability: null,
        // target_danceability: null,
      },
      duration: {
        // min_duration_ms: null,
        // max_duration_ms: null,
        // target_duration_ms: null,
      },
      energy: {
        min_energy: 0.4,
        // max_energy: null,
        // target_energy: null,
      },
      instrumentalness: {
        // min_instrumentalness: null,
        // max_instrumentalness: null,
        // target_instrumentalness: null,
      },
      key: {
        // min_key: null,
        // max_key: null,
        // target_key: null,
      },
      liveness: {
        // min_liveness: null,
        // max_liveness: null,
        // target_liveness: null,
      },
      loudness: {
        // min_loudness: null,
        // max_loudness: null,
        // target_loudness: null,
      },
      mode: {
        // min_mode: null,
        // max_mode: null,
        // target_mode: null,
      },
      popularity: {
        min_popularity: 0,
        max_popularity: 80,
        // target_popularity: null,
      },
      speechiness: {
        // min_speechiness: null,
        // max_speechiness: null,
        // target_speechiness: null,
      },
      tempo: {
        // min_tempo: null,
        // max_tempo: null,
        // target_tempo: null,
      },
      time_signature: {
        // min_time_signature: null,
        // max_time_signature: null,
        // target_time_signature: null,
      },
      valence: {
        // min_valence: null,
        // max_valence: null,
        // target_valence: null,
      },
      recs: [],
      seedResults: [],
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
      console.log(seeds);
      this.setState({
        recs: tracks,
        seedResults: seeds,
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
            <h3>ur seeds</h3>
            {this.state.seedResults.map((seed) => {
              return (
                <div key={seed.id}>
                  {seed.type}: {seed.id}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

export default Home;
