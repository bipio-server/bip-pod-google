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

function CalendarEventInsert(podConfig) {}

CalendarEventInsert.prototype = {};

/**
 * Invokes (runs) the action.
 */
CalendarEventInsert.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    exports = {},
    log = this.$resource.log,
    pod = this.pod;

  try {
    var calendarId = JSON.parse(sysImports.auth.oauth.profile).email;

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
  } catch (e) {
    next(e);
  }
}

// -----------------------------------------------------------------------------
module.exports = CalendarEventInsert;