/**
 *
 * The Bipio Google Pod.  Google Actions and Content Emitters
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Pod = require('bip-pod'),
gapi = require('googleapis'),
https = require('https'),
Google = new Pod({
  oAuthRefresh : function(refreshToken, next) {
    var c = this.getConfig();

    // @see https://developers.google.com/accounts/docs/OAuth2WebServer#refresh
    var options = {
        hostname : 'accounts.google.com',
        method : 'POST',
        path : '/o/oauth2/token',
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      },
      postBody = 'grant_type=refresh_token'
          + '&client_id=' + c.oauth.clientID
          + '&client_secret=' + c.oauth.clientSecret
          + '&refresh_token=' + refreshToken;

    // @todo migrate into pod/request
    var req = https.request(options, function(res) {
      var bodyTxt = '';

      res.on('data', function(d) {
        bodyTxt += d.toString();
      });

      res.on('end', function(d) {
        if (200 === res.statusCode) {
          next(false, JSON.parse(bodyTxt));
        } else {
          next(res.statusCode + ':' + d);
        }
      })
    });

    req.write(postBody);
    req.end();

    req.on('error', function(e) {
      next(e);
    });
  }
});

Google.profileReprOAuth = function(profile) {
  return profile.displayName;
}

Google.getOAuthClient = function(sysImports) {
  var OAuth2 = gapi.auth.OAuth2Client ? gapi.auth.OAuth2Client : gapi.auth.OAuth2,
    podConfig = this.getConfig(),
    oauth2Client = new OAuth2();

  oauth2Client.credentials = {
    access_token : sysImports.auth.oauth.access_token
  };
  return oauth2Client;
}

Google.getAPIKey = function() {
  return this.getConfig().api_key;
}

// -----------------------------------------------------------------------------
module.exports = Google;

