import React from 'react';
import './App.css';
import '../SearchBar/SearchBar';
import '../SearchResults/SearchResults';
import '../Playlist/Playlist';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [{
        name: '',
        artist: '',
        album: '',
        id: 0
      }], 
      playlistName: '',
      playlistTracks: [{
        name: '',
        artist: '',
        album: '',
        id: 0,
      }]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }

  addTrack(track) {
    const playlistTracks = this.state.playlistTracks;
    if (playlistTracks.find(savedTrack => savedTrack === track.id)) {
      return;
    } else {
      playlistTracks.push(track);
      this.setState({
        playlistTracks: playlistTracks
      });
    }
  }

  removeTrack(track) {
    const playlistTracks = this.state.playlistTracks;
    playlistTracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({
      playlistTracks: playlistTracks
    });
  }

  updatePlaylistName(name) { 
    this.setState({
      playlistName: name
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;