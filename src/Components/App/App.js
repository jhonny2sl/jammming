import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [{
        name: 'name',
        artist: 'artist',
        album: 'album',
        id: '0',
        // uri: '' // track's reference from Spotify API
      }], 
      playlistName: '',
      playlistTracks: [{
        name: 'playlistname',
        artist: 'playlistartist',
        album: 'playlistalbum',
        id: '1',
        // uri: '' // track's reference from Spotify API
      }]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    const playlistTracks = this.state.playlistTracks;
    if (playlistTracks.find(savedTrack => savedTrack === track.id)) {
      return;
    }
    playlistTracks.push(track);
    this.setState({
      playlistTracks: playlistTracks
    });
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

  savePlaylist() {
    const playlistName = this.state.playlistName;
    const playlistTracks = this.state.playlistTracks;
    const trackURIs = playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
  }

  search(term) {
    Spotify.search(term).then(searchResults => { 
      this.setState({
        searchResults: searchResults
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;