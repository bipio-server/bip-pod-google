/**
 *
 * The Bipio Google Pod.  lengthen_url action definition
 * ---------------------------------------------------------------
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
var gapi = require('googleapis');

function LengthenURL() {}

LengthenURL.prototype = {};

/**
 * Invokes (runs) the action.
 */
LengthenURL.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    var exports = {}, log = this.$resource.log;

    gapi.discover('urlshortener', 'v1').discover('plus', 'v1').execute(function(err, client) {
        var params = {
            shortUrl: imports.short_url
        };

        var req = client.urlshortener.url.get(params);

        req.execute(function (err, response) {
            if (!err && !response.code) {
                exports.short_url = response.id;
                exports.long_url = response.longUrl
            } else {
                log(err, channel, 'error');
                // @todo notify user
            }

            next(err, exports);
        });
    });
}

// -----------------------------------------------------------------------------
module.exports = LengthenURL;