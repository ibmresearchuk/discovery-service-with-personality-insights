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
function analysePersonality(author, callback){
  // Create variables to hold results
  var contentList = [];
  var contentObject = {};

  // Call discoveryQuery.getQuotes to query Watson Discovery Service(WDS) to get quotes
  discoveryQuery.getTextsByAuthor(author, getPersonalityInsight);

  // Callback from discoveryQuery.getQuotes to organise results from WDS
  function getPersonalityInsight( quoteErr, quoteData){
    if(quoteErr){
      console.log(quoteErr);
      return callback(quoteErr);
    }
    else{
      var contentList = [];
      for(var i=0; i < quoteData.length; i++){
        contentList.push(quoteData[i].text);
      }
      // Personality Insights json object containing quotes
      queryObject.json = {
        contentItems: contentList
      };

      request(queryObject, handleResponse);

      // Callback from request to handle HTTP response
      function handleResponse(err, httpResponse, body){
        console.dir(body);
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
