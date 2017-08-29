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
 * @param {String} author - The author of the article
 * @param {requestCallback} callback - Callback.
 */
function getTextsByAuthor(author, callback){
  console.log('getting text by author for ' + author);

  //Discovery Service query string
  queryObject.qs = {
    version: process.env.DISCOVERY_VERSION,
    query: 'author:'+author,
    sort: '-publication_date',
    count: 50,
    return: 'text'
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
 * @param {requestCallback} callback - Callback.
 */
function getAuthorsByCategory(category, callback){
  console.log('getting authors for category ' + category);

  //Discovery Service query string
  queryObject.qs = {
    version: process.env.DISCOVERY_VERSION,
    aggregation: 'filter(enriched_text.categories.label::'+category+').term(author, count:50)',
    count:0
  };


  request(queryObject, handleResponse);

  // Callback from request to handle HTTP response
  function handleResponse(err, httpResponse, body){
    if(err){
      console.log(err);
      return callback(err);
    }
    else{
      var aggregations = [];
      if(body){
        var jsonBody = JSON.parse(body);
        //console.dir(jsonBody,{depth:6});
        if(jsonBody.aggregations &&  jsonBody.aggregations[0].aggregations && jsonBody.aggregations[0].aggregations[0].results){
          aggregations = jsonBody.aggregations[0].aggregations[0].results;
        }
      }
      return callback(false, aggregations);
    }
  };
}


/**
 * Query Watson Discovery Service to get results
 * @param {String} name - The names a player goes by ('Rafael Nadal').
 * @param {String} author - The author of the article
 * @param {requestCallback} callback - Callback.
 */
function getSentimentByAuthor(author, callback){
  console.log('analyse wds sentiment by author:' + author);

  //Discovery Service query string
  queryObject.qs = {
    version: process.env.DISCOVERY_VERSION,
    aggregation: 'filter(author::'+author+')'
                + '.term(enriched_text.sentiment.document.label)',
    count:0
  };

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
  getAuthorsByCategory: getAuthorsByCategory,
  getSentimentByAuthor: getSentimentByAuthor,
  getTextsByAuthor: getTextsByAuthor
};
