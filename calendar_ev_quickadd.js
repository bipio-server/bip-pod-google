/**
 *
 * The Bipio Google Pod.  chrome_push action definition
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

function CalendarEventQuickAdd() {}

CalendarEventQuickAdd.prototype = {};

/**
 * Invokes (runs) the action.
 */
CalendarEventQuickAdd.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    exports = {},
    log = this.$resource.log,
    pod = this.pod;

  try {
    var calendarId = JSON.parse(sysImports.auth.oauth.profile).email;

    gapi.discover('calendar', 'v3').execute(function(err, client) {
      var authClient = self.pod.getOAuthClient(sysImports);
      var params = {
        calendarId : calendarId || 'primary',
        text : imports.text
      }

      client.calendar.events.quickAdd(params).withAuthClient(authClient).execute(function(err, result) {
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
module.exports = CalendarEventQuickAdd;
