var request = require('request');

var queryUri = 'https://gateway.watsonplatform.net/discovery/api/v1/environments/'+process.env.DISCOVERY_ENVIRONMENT_ID+'/collections/'+process.env.DISCOVERY_COLLECTION_ID+'/query';
var queryObject = {
  uri: queryUri,
  method: 'GET',
  auth: {
    user: process.env.DISCOVERY_USERNAME,
    pass: process.env.DISCOVERY_PASSWORD
  }
};

/**
 * Query Watson Discovery Service to get results
 * @param {String[]} names - The names a player goes by (e.g. ['Rafael Nadal', 'nadal', 'raffa']).
 * @param {requestCallback} callback - Callback.
 */
function getHits(name, callback){
  console.log('Querying WDS for ' + name);

  //Discovery Service query string
  queryObject.qs = {
    version: process.env.DISCOVERY_VERSION,
    query: 'entities.text:('+name+')',
    filter: 'entities.type:Person',
    count: 50
  };

  request(queryObject, handleResponse);

  // Callback from request to handle HTTP response
  function handleResponse(err, httpResponse, body){
    if(err){
      console.log(err);
      return callback(err);
    }
    else{
      var results = [];
      if(body){
        var jsonBody = JSON.parse(body);
        if(jsonBody.results){
          results = jsonBody.results;
        }
      }
      return callback(false, results);
    }
  };
}

/**
 * Query Watson Discovery Service to get quotes
 * @param {String[]} names - The names a player goes by (e.g. ['Rafael Nadal', 'nadal', 'raffa']).
 * @param {requestCallback} callback - Callback.
 */
function getQuotes(name, callback){
  console.log('Loooking for quotes');
  console.log('Querying WDS for ' + name);

  //Discovery Service query string to retrieve quotes
  queryObject.qs = {
    version: process.env.DISCOVERY_VERSION,
    query: 'entities.text:('+name+')',
    filter: 'entities.type:Person,'
          + 'entities.quotations.sentiment.type::(neutral|positive|negative)',
    return: 'entities.quotations,'
          + 'entities.text,'
          + 'quotations.quotation,'
          + 'entities.type',
    count: 50
  };

  request(queryObject, handleResponse);

  // Callback from request to handle HTTP response
  function handleResponse(err, httpResponse, body){
    if(err){
      console.log(err);
      return callback(err);
    }
    else{
      var results = [];
      if(body){
        var jsonBody = JSON.parse(body);
        if(jsonBody.results){
          results = jsonBody.results;
        }
      }
      return callback(false, results);
    }
  };
}

module.exports = {
  getHits:getHits,
  getQuotes:getQuotes
};
