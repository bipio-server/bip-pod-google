/**
 *
 * The Bipio Google Pod.  chrome_push action definition
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2014 CloudSpark pty ltd http://www.cloudspark.com.au
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
var gapi = require('googleapis'),
  fs = require('fs');

function CreateFile(podConfig) {
  this.name = 'create_drive_file';
  this.description = 'Create a File on Google Drive',
  this.description_long = "Uploads any present file to Google drive",
  this.trigger = false;
  this.singleton = true;
  this.podConfig = podConfig;
}

CreateFile.prototype = {};

CreateFile.prototype.getSchema = function() {
  return {    
    'exports' : {
      properties : {
        id : {
          type : 'string',
          description : 'File ID'
        }
      }
    }
  }
}

CreateFile.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this, 
    exports = {}, 
    log = this.$resource.log, 
    pod = this.pod;

  gapi.discover('drive', 'v2').execute(function(err, client) {
    var auth = self.pod.getOAuthClient(sysImports);
    for (var i = 0; i < contentParts._files.length; i++) {
      (function(file) {
        fs.readFile(file.localpath, function(err, buffer) {
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