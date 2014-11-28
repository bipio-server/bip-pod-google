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