const accessToken = '';
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

        console.log(matchedAccessToken);
        console.log(matchedExpiresIn);

        if (matchedAccessToken && matchedExpiresIn) { 
            // Set the access token value
            accessToken = matchedAccessToken[1];
            // Set a variable for expiration time
            const expiresIn = matchedExpiresIn[1];
            // Set the access token to expire at the value for expiration time
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            // Clear the parameters from the URL, so the app doesn’t try grabbing the access token after it has expired
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        }
    }
};

export default Spotify;