/**
 *
 * The Bipio Google Pod.  chrome_push action definition
 * ---------------------------------------------------------------
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
var gapi = require('googleapis');

function CalendarEventQuickAdd(podConfig) {
  this.name = 'calendar_ev_quickadd';
  this.description = 'Quick-Add a Calendar Event',
  this.description_long = "Creates an event based on a simple text string",
  this.trigger = false;
  this.singleton = true;
  this.podConfig = podConfig;
}

CalendarEventQuickAdd.prototype = {};

CalendarEventQuickAdd.prototype.getSchema = function() {
  return {
    /*
    config : {
      properties : {
        calendarId: {
          type : "string",
          description : "Calendar ID"
        }
      }
    },*/
    'exports' : {
      properties : {
        status : {
          type : 'string',
          description : 'Status'
        },
        id : {
          type : 'string',
          description : 'ID'
        },
        created : {
          type : 'string',
          description : 'Created Time'
        },
        summary : {
          type : 'string',
          description : 'Summary'
        },
        description : {
          type : 'string',
          description : 'Description'
        },
        location : {
          type : 'string',
          description : 'Location'
        },
        start_date : {
          type : 'string',
          description : 'Start Date'
        },
        start_datetime : {
          type : 'string',
          description : 'Start DateTime'
        },
        start_timezone : {
          type : 'string',
          description : 'Start TimeZone'
        },
        end_date : {
          type : 'string',
          description : 'End Date'
        },
        end_datetime : {
          type : 'string',
          description : 'End DateTime'
        },
        end_timezone : {
          type : 'string',
          description : 'End TimeZone'
        },
        attendees : {
          type : 'array',
          description : 'Attendees'
        }
      }
    },
    "imports": {
      properties : {
        'text' : {
          type : 'string',
          description : 'Event Text'
        }
      }
    }
  }
}

/**
 * Invokes (runs) the action.
 */
CalendarEventQuickAdd.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this, 
    exports = {}, 
    log = this.$resource.log, 
    pod = this.pod;

  if (imports.text) {
    var calendarId = sysImports.auth.oauth.profile.email;
    gapi.discover('calendar', 'v3').execute(function(err, client) {
      var OAuth2 = gapi.auth.OAuth2Client,
        oauth2Client = new OAuth2(self.podConfig.oauth.clientID, self.podConfig.oauth.clientSecret, self.podConfig.oauth.callbackURL);
        
      oauth2Client.credentials = {
        access_token : sysImports.auth.oauth.token
      };
 
      var params = {
        calendarId : calendarId,
        text : imports.text
      }

      client.calendar.events.quickAdd(params).withAuthClient(oauth2Client).execute(function(err, result) {
        var exports = {};
        if (err) {
          log(err, channel, 'error');
        } else {
          exports = app._.clone(result);
          exports.start_date = result.start.date;
          exports.start_datetime = result.start.datetime;
          exports.start_timezone = result.start.timezone;          
          exports.end_date = result.end.date;
          exports.end_datetime = result.end.datetime;
          exports.end_timezone = result.end.timezone;          
        }
        next(err, exports);
      });
 
    });
  } else {
    // silent passthrough
    next(false, exports);
  }
}

// -----------------------------------------------------------------------------
module.exports = CalendarEventQuickAdd;