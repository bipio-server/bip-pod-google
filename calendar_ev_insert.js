/**
 *
 * The Bipio Google Pod
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2013 Michael Pearson https://github.com/mjpearson
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

function CalendarEventInsert(podConfig) {
    this.name = 'calendar_ev_insert';
    this.description = 'Insert a Calendar Event',
    this.description_long = "Creates a Google Calendar Event With Structured Data",
    this.trigger = false;
    this.singleton = true;
    this.podConfig = podConfig;
}

CalendarEventInsert.prototype = {};

CalendarEventInsert.prototype.getSchema = function() {
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
    'imports' : {
      properties : {
        attendees_emails : {
          type : 'string',
          description : 'Comma Separated Attendee Emails'
        },
        reminder_method : {
          type : 'string',
          description : 'Reminder Method (email|sms|popup)'
        },
        reminder_minutes : {
          type : 'integer',
          description : '# Minutes Prior to send Reminder'
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
  }
}

/**
 * Invokes (runs) the action.
 */
CalendarEventInsert.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this, 
    exports = {}, 
    log = this.$resource.log, 
    pod = this.pod;

  if (imports.text) {
    var calendarId = sysImports.auth.oauth.profile.email;    
    
    gapi.discover('calendar', 'v3').execute(function(err, client) {
      var authClient = self.pod.getOAuthClient(sysImports);
      var params = {
        calendarId : calendarId,
        start : {
          date : imports.start_date,
          dateTime : imports.start_datetime,
          timeZone : imports.start_timezone
        },
        end : {
          date : imports.end_date,
          dateTime : imports.end_datetime,
          timeZone : imports.end_timezone
        },
        attendees : [],
        reminders : {
          overrides : [
            {
              method : imports.reminder_method || 'email',
              minutes : imports.reminder_minutes || 15
            }
          ]
        }
      }

      var attendees = imports.attendees.split(',');
      for (var i = 0; i < attendees.length; i++) {
        params.attendees.push(attendees[i].trim());
      }

      client.calendar.events.insert(params).withAuthClient(authClient).execute(function(err, result) {
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
module.exports = CalendarEventInsert;