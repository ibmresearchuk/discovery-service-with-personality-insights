var discoveryQuery = require('./discoveryQuery');
var utils = require('./utils');

/**
 * Analyse person
 * @param {String} name - person name
 * @param {String} dir - path to output results to
*/
function analyse(name, dir){
  console.log('Running analysis on Watson Discovery News dataset. Querying ' + name + '.\nResults output to: ' + dir+'/results.csv');

  // Analyse hits about a person
  analyseHits(name, writeResultToFile);

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
function analyseHits(name, callback){
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
  discoveryQuery.getHits(name, organiseResults);

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
          if(data[i].docSentiment.type == 'negative'){
            playerTerms.hits_negative++;
          } else if(data[i].docSentiment.type == 'positive') {
            playerTerms.hits_positive++;
          } else {
            playerTerms.hits_neutral++;
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
  analyse: analyse
};
