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
var gapi = require('googleapis'),
  fs = require('fs');

function CreateFile() {}

CreateFile.prototype = {};

CreateFile.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    exports = {},
    log = this.$resource.log,
    pod = this.pod;

  gapi.discover('drive', 'v2').execute(function(err, client) {
    var auth = self.pod.getOAuthClient(sysImports);
    for (var i = 0; i < contentParts._files.length; i++) {
      (function(file) {
        $resource.file.get(file.localpath, function(err, buffer) {
          if (err) {
            next(err);
          } else {
            var args = {
              title: file.name,
              mimeType: file.type
            }
            client.drive.files.insert(args)
              .withMedia(file.type, buffer)
              .withAuthClient(auth)
              .execute(function(err, result) {
                next(err, result, contentParts, buffer.size);
              });
          }
        });
      })(contentParts._files[i]);
    }
  });

}

// -----------------------------------------------------------------------------
module.exports = CreateFile;