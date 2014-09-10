/**
 *
 * The Bipio Google Pod.  lengthen_url action definition
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var gapi = require('googleapis');

function LengthenURL(podConfig) {
    this.name = 'lengthen_url';
    this.title = 'Lengthen a URL',
    this.description = 'Lengthens an existing shortened URL. The Google URL Shortener API allows you to shorten URLs just as you would on goo.gl.',
    this.trigger = false;
    this.singleton = true;
    this.podConfig = podConfig;
}

LengthenURL.prototype = {};

LengthenURL.prototype.getSchema = function() {
    return {
        'exports' : {
            properties : {
                'short_url' : {
                    type : 'string',
                    description : 'Short URL (URL ID)'
                },
                'long_url' : {
                    type : 'string',
                    description : 'Long URL'
                }
            },
            required : [ 'short_url' ]
        },
        "imports": {
            properties : {
                'short_url' : {
                    type : 'string',
                    description : 'Short URL (URL ID)'
                }
            }
        }
    }
}

/**
 * Invokes (runs) the action.
 */
LengthenURL.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    var exports = {}, log = this.$resource.log;

    if (imports.short_url) {
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
}

// -----------------------------------------------------------------------------
module.exports = LengthenURL;