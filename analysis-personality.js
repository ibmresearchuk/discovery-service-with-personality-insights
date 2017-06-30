var utils = require('./utils');
var piQuery = require('./piQuery');

/**
 * Analyse personality
 * @param {String} name - person name
 * @param {String} dir - path to output results to
*/
function analyse(name, dir){
  console.log('Analysing personality using Watson Personality Insights. \nRunning analysis on Watson Discovery News data and retrieving quotes. Querying ' + name + '. Results output to: ' + dir+'/' + name + '.csv');

  // Analyse personality from quotes about a person
  analysePersonalityFromQuotes(name, writeResultToFile);

  //Callback from analysePersonalityFromQuotes to write result to file
  function writeResultToFile(err, data){
    if(err){
      console.log(err);
    }
    else if(dir){
      // Write Big five personality characteristic data to file as CSV
      utils.writeCsvDataTofile(dir + '/' + name + '.csv',data, [
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
 * @param {String} names - The name of a player
 * @param {requestCallback} callback - Callback.
 */
function analysePersonalityFromQuotes(name, callback){
  // Create variable to hold result
  var processedResults = {
    emotionalRange: 0,
    agreeableness: 0,
    conscientiousness: 0,
    openness: 0,
    extraversion: 0
  };

  // Call piQuery.analysePersonality to analysis personality
  piQuery.analysePersonality(name, organisePI);

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
          console.log('Error in personality for: ' + name + ' ' + data.error);
        }
        else{
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
          processedResults.name = name;
        }
      }
      return callback(false,processedResults);
    }
  };
}

module.exports = {
  analyse: analyse
};
