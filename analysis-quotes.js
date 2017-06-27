var discoveryQuery = require('./discoveryQuery');
var utils = require('./utils');

/**
 * Analyse person and get quotes
 * @param {String} name - person name
 * @param {String} dir - path to output results to
*/
function analyse(name, dir){
  console.log('Running analysis on Watson Discovery News dataset and retrieving quotes. Querying ' + name + '.\nResults output to: ' + dir+'/results.csv');

  // Analyse quotes about a person
  analyseQuotes(name, writeResultToFile);

  //Callback from analyseTerms to write results to file
  function writeResultToFile(err, data){
    if(err){
      console.log(err);
    }
    else if(dir){
      // Uncomment to output quotes to console.
      //console.dir(data);

      // Write data to file as CSV
      utils.writeCsvDataTofile(dir + '/' + name + '.csv',data, ['name','hits','hits_negative','hits_positive', 'hits_neutral'], function(writeErr){
        if(writeErr){
          console.log(writeErr);
        }
      });
    }
  };
}

/**
 * Analyse quotes about a person
 * @param {String} names - The name of a player
 * @param {requestCallback} callback - Callback.
 */
function analyseQuotes(name, callback){
  // Create variable to hold result
  var playerTerms = {
    name: name,
    hits: 0,
    hits_positive: 0,
    hits_neutral: 0,
    hits_negative: 0,
    terms_hits: []
  };

  // Call discoveryQuery.getQuotes to query Watson Discovery Service(WDS) to get quotes
  discoveryQuery.getQuotes(name, organiseQuotes);

  // Callback from discoveryQuery.getQuotes to organise results from WDS
  function organiseQuotes(quoteErr, quoteData){
    if(quoteErr){
      console.log(quoteErr);
      return callback(quoteErr);
    }
    else{
      // Check data have been returned from WDS.
      if(quoteData){
        for(var i=0; i < quoteData.length; i++){
          // Check each data has an entitity property
          for(var j=0; j<quoteData[i].entities.length; j++){
            if(quoteData[i].entities[j].quotations){
              // Check each entitity has a quotations property
              for(var k=0; k<quoteData[i].entities[j].quotations.length; k++){
                if (quoteData[i].entities[j].quotations[k].quotation){
                  // Push quotation to terms_hits property
                  playerTerms.terms_hits.push(quoteData[i].entities[j].quotations[k].quotation);
                  // Check if sentiment of quote is negative, positive or neutral
                  if( quoteData[i].entities[j].quotations[k].sentiment.type == 'negative') {
                    playerTerms.hits_negative++;
                  } else if(quoteData[i].entities[j].quotations[k].sentiment.ype == 'positive') {
                    playerTerms.hits_positive++;
                  } else {
                    playerTerms.hits_neutral++;
                  }
                }
              }
            }
          }
        }
        // Count the number of quotes by adding the number of positive, negative and netural quotes.
        playerTerms.hits = playerTerms.hits_negative + playerTerms.hits_positive + playerTerms.hits_neutral;
      }
      return callback(false, playerTerms);
    }
  };
}

module.exports = {
  analyse: analyse
};
