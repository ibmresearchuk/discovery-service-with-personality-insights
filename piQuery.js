var request = require('request');
var discoveryQuery = require('./discoveryQuery');

var queryObject = {
  uri: process.env.PERSONALITY_URL,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  auth: {
    user: process.env.PERSONALITY_USERNAME,
    pass: process.env.PERSONALITY_PASSWORD
  },
  qs:{
    version: process.env.PERSONALITY_VERSION,
  }
};

/**
 * Query Personality Insights service to get results
 * @param {String[]} names - The names a player goes by (e.g. ['Rafael Nadal', 'nadal', 'raffa']).
 * @param {requestCallback} callback - Callback.
 */
function analysePersonality(name, callback){
  // Create variables to hold results
  var contentList = [];
  var contentObject = {};

  // Call discoveryQuery.getQuotes to query Watson Discovery Service(WDS) to get quotes
  discoveryQuery.getQuotes(name, getPersonalityInsight);

  // Callback from discoveryQuery.getQuotes to organise results from WDS
  function getPersonalityInsight( quoteErr, quoteData){
    if(quoteErr){
      console.log(quoteErr);
      return callback(quoteErr);
    }
    else{
      // Check data have been returned from Watson Personality Insights.
      if(quoteData){
        for(var i=0; i < quoteData.length; i++){
          // Check each data has an entitity property
          for(var j=0; j<quoteData[i].entities.length; j++){
            if(quoteData[i].entities[j].quotations){
              // Check each entitity has a quotations property
              for(var k=0; k<quoteData[i].entities[j].quotations.length; k++){
                if (quoteData[i].entities[j].quotations[k].quotation){
                  // Update contentObject with quotation
                  var contentObject = {
                    content: quoteData[i].entities[j].quotations[k].quotation,
                  };
                  // Push contentObject with quotation to contentList
                  contentList.push(contentObject);
                }
              }
            }
          }
        }
      }

      // Personality Insights json object containing quotes
      queryObject.json = {
        contentItems: contentList
      };

      request(queryObject, handleResponse);

      // Callback from request to handle HTTP response
      function handleResponse(err, httpResponse, body){
        if(err){
          return callback(err);
        }
        else{
          callback(false,body);
        }
      }
    }
  }
}

module.exports = {
  analysePersonality:analysePersonality
};
