var discoveryQuery = require('./discoveryQuery');
var utils = require('./utils');


/**
 * Analyse person
 * @param {String} catgeory - category to list authors for
*/
function listAuthors(category, dir){
  // Analyse hits about a person
  discoveryQuery.getAuthorsByCategory(category, writeResultToFile);

  //Callback from getAuthorsByCategory to write results to file
  function writeResultToFile(err, data){
    if(err){
      console.log(err);
    }
    else if(dir){
      var processedData = [];
      for(var i=0; i < data.length; i++){
        var item = {
          author: data[i].key,
          documents: data[i].matching_results
        };
        processedData.push(item);
      }

      // Write data to file as CSV
      var filename = 'authors_' + category.replace(/ /g, '_');
      filename = category.replace(/\//g, '_') + '.csv';
      filename = filename.toLowerCase();
      utils.writeCsvDataTofile(dir + '/' + filename, processedData, ['author','documents'], function(writeErr){
        if(writeErr){
          console.log(writeErr);
        }
      });
    }
  };
}


/**
 * Analyse person
 * @param {String} name - person name
 * @param {String} author - author's name
 * @param {String} dir - path to output results to
*/
function aggregateSentiment(author, dir){

  // Analyse hits about a person
  discoveryQuery.getSentimentByAuthor(author, writeResultToFile);

  //Callback from analyseTerms to write results to file
  function writeResultToFile(err, data){
    if(err){
      console.log(err);
    }
    else if(dir){
      // Uncomment to output personality insights to to console.
      console.dir(data);
      processedData = {
      };

      for(var i=0; i < data.length; i++){
        var field = data[i].key;
        var value = data[i].matching_results;
        processedData[field] = value;
      }

      // Write data to file as CSV
      var filename = 'sentiment_' + author.replace(/ /g, '_');
      filename = filename.toLowerCase();
      utils.writeCsvDataTofile(dir + '/' + filename + '.csv',processedData, ['negative','positive','neutral'], function(writeErr){
        if(writeErr){
          console.log(writeErr);
        }
      });
    }
  };
}


module.exports = {
  listAuthors:listAuthors,
  aggregateSentiment: aggregateSentiment
};
