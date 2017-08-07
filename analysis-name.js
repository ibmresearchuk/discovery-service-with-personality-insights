var discoveryQuery = require('./discoveryQuery');
var utils = require('./utils');



/**
 * Analyse person
 * @param {String} catgeory - category to list authors for
*/
function listAuthors(category, dir){

  // Analyse hits about a person
  discoveryQuery.getAuthorsByCateogory(category, writeResultToFile);

  //Callback from getAuthorsByCateogory to write results to file
  function writeResultToFile(err, data){
    if(err){
      console.log(err);
    }
    else if(dir){
      // Uncomment to output personality insights to to console.
      //console.dir(data);

      var processedData = [];
      for(var i=0; i < data.length; i++){
        var item = {
          author: data[i].key,
          documents: data[i].matching_results
        };
        processedData.push(item);
      }

      // Write data to file as CSV
      utils.writeCsvDataTofile(dir + '/categories.csv', processedData, ['author','documents'], function(writeErr){
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
function aggregateSentiment(name, author, dir){

  // Analyse hits about a person
  discoveryQuery.getSentimentByAuthor(name, author, writeResultToFile);

  //Callback from analyseTerms to write results to file
  function writeResultToFile(err, data){
    if(err){
      console.log(err);
    }
    else if(dir){
      // Uncomment to output personality insights to to console.
      console.dir(data);
      processedData = {
        name: name
      };

      for(var i=0; i < data.length; i++){
        var field = data[i].key;
        var value = data[i].matching_results;
        processedData[field] = value;
      }

      // Write data to file as CSV
      utils.writeCsvDataTofile(dir + '/' + name + '.csv',processedData, ['name','negative','positive','neutral'], function(writeErr){
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
function analyse(name, author, dir){
  console.log('Running analysis on Watson Discovery News dataset. Querying ' + name + '.\nResults output to: ' + dir+'/' + name + '.csv');

  // Analyse hits about a person
  analyseHits(name, author, writeResultToFile);

  //Callback from analyseTerms to write results to file
  function writeResultToFile(err, data){
    if(err){
      console.log(err);
    }
    else if(dir){
      // Uncomment to output personality insights to to console.
      //console.dir(data);

      // Write data to file as CSV
      utils.writeCsvDataTofile(dir + '/' + name + '.csv',data, ['name','hits','hits_negative','hits_positive', 'hits_neutral'], function(writeErr){
        if(writeErr){
          console.log(writeErr);
        }
      });
    }
  };
};

/**
 * Analyse articles about a person
 * @param {String} names - The name of a player
 * @param {requestCallback} callback - Callback.
 */
function analyseHits(name, author, callback){
  // Create variable to hold result
  var playerTerms = {
    name: name,
    hits: 0,
    hits_positive: 0,
    hits_neutral: 0,
    hits_negative: 0,
    terms_hits: []
  };

  // Call discoveryQuery.getHits to query Watson Discovery Service(WDS) to get articles
  if(!author){
    discoveryQuery.getHits(name, organiseResults);
  }
  else{
    discoveryQuery.getHitsByAuthor(name, author, organiseResults);
  }


  // Callback from discoveryQuery.getHits to organise results from WDS
  function organiseResults(dataErr, data){
    if(dataErr){
      console.log(dataErr);
      return callback(dataErr);
    }
    else{
      // Check data have been returned from WDS.
      if(data){
        for(var i=0; i < data.length; i++){
          // Push hits to terms_hits property
          playerTerms.terms_hits.push(data[i].text);
          // Check if sentiment of hits is negative, positive or neutral
          if(data[i].enriched_text.sentiment && data[i].enriched_text.sentiment.document ){
            if(data[i].enriched_text.sentiment && data[i].enriched_text.sentiment.document.label == 'negative'){
              playerTerms.hits_negative++;
            } else if(data[i].enriched_text.sentiment && data[i].enriched_text.sentiment.document.label == 'positive') {
              playerTerms.hits_positive++;
            } else {
              playerTerms.hits_neutral++;
            }
          }
        }
        // Find out the number of hits
        playerTerms.hits = data.length;
      }
      return callback(false, playerTerms);
    }
  };
}

module.exports = {
  analyse: analyse,
  listAuthors:listAuthors,
  aggregateSentiment: aggregateSentiment
};
