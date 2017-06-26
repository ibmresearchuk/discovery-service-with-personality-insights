var json2csv = require('json2csv');
var mkdirp = require('mkdirp');
var fs = require('fs');

function writeCsvDataTofile(file, data, fields, callback){
  var getDirName = require('path').dirname;

  mkdirp(getDirName(file), function(err){
    if(err){
      return callback(err);
    }
    var csv = json2csv({ data: data, fields: fields });

    fs.writeFile(file, csv, function(err) {
      if(err){
        console.log(err);
      }
      callback(err);
    });
  });
}

module.exports = {
  writeCsvDataTofile: writeCsvDataTofile
};
