let accessToken;
const client_id = '94653a7e35674665a40bd7f708696bc2';
const redirect_uri = 'http://localhost:3000/';

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        /*
        Parsing user's access token URL response, 
        Check if the values exist and matching, and 
        Set the values (as query parameters) for access token and expiration time
        */
        const matchedAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const matchedExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
/* 
        console.log(matchedAccessToken);
        console.log(matchedExpiresIn);
 */
        if (matchedAccessToken && matchedExpiresIn) {
            // Set the access token value
            accessToken = matchedAccessToken[1];
            // Set a variable for expiration time
            const expiresIn = Number(matchedExpiresIn[1]);
            // Set the access token to expire at the value for expiration time
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            // Clear the parameters from the URL, so the app doesn’t try grabbing the access token after it has expired
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else /* if (!matchedAccessToken && !matchedExpiresIn) */ {
            // Redirect users to the application using web browser
            window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
        }
    },

    search(term) {
        const retrievedAccessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${retrievedAccessToken}`
            }
        })
            .then(response => response.json())
            .then(jsonResponse => { 
                if (!jsonResponse.tracks) {
                    return [];
                }
                return jsonResponse.tracks.items.map(track => { 
                    return {
                        id: track.id,
                        name: track.name, 
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    };
                });
            });
    },

    savePlaylist(playlistName, trackUris) {
        if (!playlistName || !trackUris.length) {
            return;
        }

        const retrievedAccessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${retrievedAccessToken}`
        };
        let userID;
        
        // GET current user's Profile, for User's ID
        return fetch(`https://api.spotify.com/v1/me`, { headers: headers })
            .then(response => response.json())
            .then(jsonResponse => {
                userID = jsonResponse.id;
                // POST Create Playlist, with the input name to the current user’s Spotify account. Receive the playlist ID back from the request
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({
                        name: playlistName
                    })
                })
                    .then(response => response.json())
                    .then(jsonResponse => {
                        const playlistID = jsonResponse.id;
                        // POST Add Items to Playlist, referencing the current user’s account (ID) and the new playlist (ID)
                        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({
                                uris: trackUris
                            })
                        });
                    }
                );
            }
        );


        
    }
};

export default Spotify;