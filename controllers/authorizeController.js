const SpotifyWebAPI = require('spotify-web-api-node');
let querystring = require('querystring');
const
    scopes = ["user-read-private", "user-read-email"],
    redirectUri = 'http://localhost:1111/artists',
    clientId = 'c694e18ae9904b87bb2df943798a800d',
    clientSecret = '8aa7d468f3ba45248763c7ff2e9da718',
    authorizeSpotify = 'https://accounts.spotify.com/authorize?';

const spotifyAPI = new SpotifyWebAPI({
    redirectUri: redirectUri,
    clientId: clientId,
    clientSecret: clientSecret
});

let stateKey = 'spotify_auth_state';

let tokenExpiration;

let generateRandomString = function(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

// Authorize with Spotify by getting access token
exports.authorize = function(authorizeRequest, authorizeResponse) {
    //loginResponse.render('login');
    // handle with OAuth
    //showAuthorization = authorizeResponse.render('login with Spotify');
    /*showAuthorization = authorizeResponse.redirect(authorizeSpotify +
        '?response_type=token' +
        '&clientId=' + clientId +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirectUri=' + encodeURIComponent(redirectUri));*/

    //access_token = getAccessToken(showAuthorization);
    //console.log(access_token);
    let state = generateRandomString(16);
    authorizeResponse.cookie(stateKey, state);

    const
        scopes = ["user-read-private", "user-read-email"],
        redirectUri = 'http://localhost:1111/artists',
        clientId = 'c694e18ae9904b87bb2df943798a800d',
        clientSecret = '8aa7d468f3ba45248763c7ff2e9da718',
        authorizeSpotify = 'https://accounts.spotify.com/authorize?';

    authorizeResponse.redirect(authorizeSpotify +
        /*'?response_type=code' +
        '&client_Id=' + spotifyAPI.clientId +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(spotifyAPI.redirectUri +
            '&state=' + state)*/
        querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scopes,
            redirect_uri: redirectUri,
            state: state
        })
    );


    /*spotifyAPI.authorizationCodeGrant(authorizeResponse).then(
        function(data) {
            // Set the access token and refresh token
            spotifyAPI.setAccessToken(data.body['access_token']);
            spotifyAPI.setRefreshToken(data.body['refresh_token']);

            // Save the amount of seconds until the access token expired
            tokenExpiration =
                new Date().getTime() / 1000 + data.body['expires_in'];
            console.log(
                'Retrieved token. It expires in ' +
                Math.floor(tokenExpiration - new Date().getTime() / 1000) +
                ' seconds!'
            );
        },
        function(err) {
            console.log(
                'Something went wrong when retrieving the access token!',
                err.message
            );
        }
    );

    // Continually print out the time left until the token expires..
    let numberOfTimesUpdated = 0;

    setInterval(function() {
        console.log(
            'Time left: ' +
            Math.floor(tokenExpiration - new Date().getTime() / 1000) +
            ' seconds left!'
        );

        // OK, we need to refresh the token. Stop printing and refresh.
        if (++numberOfTimesUpdated > 5) {
            clearInterval(this);

            // Refresh token and print the new time to expiration.
            spotifyAPI.refreshAccessToken().then(
                function(data) {
                    tokenExpiration =
                        new Date().getTime() / 1000 + data.body['expires_in'];
                    console.log(
                        'Refreshed token. It now expires in ' +
                        Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
                        ' seconds!'
                    );
                },
                function(err) {
                    console.log('Could not refresh the token!', err.message);
                }
            );
        }
    }, 1000);*/
}

exports.callback = function(callbackRequest, callbackResponse) {
    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirectUri: redirectUri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function(error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
}

exports.refresh_token = function(refreshTokenRequest, refreshTokenResponse) {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
}