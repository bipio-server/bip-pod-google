/**
 *
 * The Bipio Google Pod
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
console.log(imports);
      var attendees = imports.attendees_emails.split(',');
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