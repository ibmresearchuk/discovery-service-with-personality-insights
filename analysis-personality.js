var utils = require('./utils');
var piQuery = require('./piQuery');

/**
 * Analyse personality
 * @param {String} author - author of the quotes
 * @param {String} dir - path to output results to
*/
function analyse(author, dir){
  console.log('Analysing personality using Watson Personality Insights. \nRunning analysis on Watson Discovery News data and retrieving quotes. Querying ' + author + '. Results output to: ' + dir+'/' + author + '.csv');

  // Analyse personality from quotes about a person
  analysePersonalityFromQuotes(author, writeResultToFile);

  //Callback from analysePersonalityFromQuotes to write result to file
  function writeResultToFile(err, data){
    if(err){
      console.log(err);
    }
    else if(dir){
      // Write Big five personality characteristic data to file as CSV
      utils.writeCsvDataTofile(dir + '/' + author + '.csv', data, [
        'name',
        'openness',
        'emotionalRange',
        'conscientiousness',
        'agreeableness',
        'extraversion',
      ],
      function(writeErr){
        if(writeErr){
          console.log(writeErr);
        }
      });
    }
  };
}

/**
 * Analyse personality from quotes about a person
 * @param {String} author - The author of a quotes
 * @param {requestCallback} callback - Callback.
 */
function analysePersonalityFromQuotes(author, callback){
  // Create variable to hold result
  var processedResults = {
    emotionalRange: 0,
    agreeableness: 0,
    conscientiousness: 0,
    openness: 0,
    extraversion: 0
  };

  // Call piQuery.analysePersonality to analysis personality
  piQuery.analysePersonality(author, organisePI);

  // Callback from piQuery.analysePersonality to organise results from Personality Insights
  function organisePI(piErr, data){
    // Uncomment to output personality insights to to console.
    //console.dir(data);
    if(piErr){
      console.log(piErr);
      return callback(piErr);
    }
    else{
      // Check data have been returned from Personality Insights
      if(data){
        if(data.error){
          console.log('Error in personality for: ' + author + ' ' + data.error);
        }
        else{
          console.dir(data);
          if(data.personality){
            // Assign personality Attributes to results object
            for(var i=0; i < data.personality.length; i++){
              var personalityAttribute = data.personality[i];
              if(personalityAttribute.trait_id === 'big5_neuroticism'){
                processedResults.emotionalRange = personalityAttribute.percentile;
              }
              if(personalityAttribute.trait_id === 'big5_agreeableness'){
                processedResults.agreeableness = personalityAttribute.percentile;
              }
              if(personalityAttribute.trait_id === 'big5_conscientiousness'){
                processedResults.conscientiousness = personalityAttribute.percentile;
              }
              if(personalityAttribute.trait_id === 'big5_openness'){
                processedResults.openness = personalityAttribute.percentile;
              }
              if(personalityAttribute.trait_id === 'big5_extraversion'){
                processedResults.extraversion = personalityAttribute.percentile;
              }
            }
          }
          processedResults.name = author;
        }
      }
      return callback(false,processedResults);
    }
  };
}

module.exports = {
  analyse: analyse
};
