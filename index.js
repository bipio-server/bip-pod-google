/**
 * 
 * The Bipio Google Pod.  Google Actions and Content Emitters
 * 
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2013 CloudSpark pty ltd http://www.cloudspark.com.au
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
var Pod = require('bip-pod'),
    Google = new Pod({
        name : 'google',
        description : 'Google',
        description_long : 'Google APIs is a set of APIs developed by Google that allows interaction with Google Services and integration of rich, multimedia, search or feed-based Internet content into web applications',
        authType : 'none', // @todo hybrid api keys/oauth tokens
        config : {
            "oauth": {
               "consumerKey" : "",
               "consumerSecret" : ""
            },
            "issuer_token" : {
                "password" : ""        
            }
        }
    });

Google.add(require('./lengthen_url.js'));
Google.add(require('./shorten_url.js'));

// -----------------------------------------------------------------------------
module.exports = Google;
