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
  console.log('searching wds for ' + name);

  //Discovery Service query string
  queryObject.qs = {
    version: process.env.DISCOVERY_VERSION,
    query: 'enriched_text.entities.text:('+name+')',
    filter: 'enriched_text.entities.type:Person',
    sort: '-publication_date',
    count: 50,
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
 * Query Watson Discovery Service to get results
 * @param {String} name - The names a player goes by ('Rafael Nadal').
 * @param {String} author - The author of the article
 * @param {requestCallback} callback - Callback.
 */
function getHitsByAuthor(name, author, callback){
  console.log('searching wds for ' + name);

  //Discovery Service query string
  queryObject.qs = {
    version: process.env.DISCOVERY_VERSION,
    query: 'enriched_text.entities.text:'+name+','
          +'author:'+author,
    filter: 'enriched_text.entities.type:Person',
    sort: '-publication_date',
    count: 50,
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
 * Query Watson Discovery Service to get results
 * @param {String} name - The names a player goes by ('Rafael Nadal').
 * @param {String} author - The author of the article
 * @param {requestCallback} callback - Callback.
 */
function getSentimentByAuthor(name, author, callback){
  console.log('aggregating wds for ' + name);

  //Discovery Service query string
  if(!author){
    queryObject.qs = {
      version: process.env.DISCOVERY_VERSION,
      aggregation: 'filter(enriched_text.entities.text:'+name+','
                  + 'enriched_text.entities.type:Person).'
                  + 'term(enriched_text.sentiment.document.label)',
      count:0
    };
  }
  else{
    queryObject.qs = {
      version: process.env.DISCOVERY_VERSION,
      aggregation: 'filter(enriched_text.entities.text:'+name+','
                  + 'author:'+author+','
                  + 'enriched_text.entities.type:Person).'
                  + 'term(enriched_text.sentiment.document.label)',
      count:0
    };
  }

  request(queryObject, handleResponse);

  // Callback from request to handle HTTP response
  function handleResponse(err, httpResponse, body){
    if(err){
      console.log(err);
      return callback(err);
    }
    else{
      //console.dir(body);
      var aggregations = [];
      if(body){
        var jsonBody = JSON.parse(body);
        if(jsonBody.aggregations &&  jsonBody.aggregations[0].aggregations && jsonBody.aggregations[0].aggregations[0].results){
          aggregations = jsonBody.aggregations[0].aggregations[0].results;
        }
      }
      return callback(false, aggregations);
    }
  };
}

module.exports = {
  getHits:getHits,
  getHitsByAuthor:getHitsByAuthor,
  getSentimentByAuthor: getSentimentByAuthor
};
