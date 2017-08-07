#!/usr/bin/env node
require('dotenv').config();
var program = require('commander');
var analysisName = require('./analysis-name');
var analysisPersonality = require('./analysis-personality');

program
  .version('1.0.0')
  .description('Cognitive analysis of Watson Discovery News data.')
  .option('-a, --author [author]', 'Authors.')
  .option('-c, --category [category]', 'category to list authors for, e.g. /sports/tennis')
  .option('-p, --person [person]', 'Persons name.')
  .option('-i, --insights', 'Analyse for personality')
  .option('-d, --dir [dir]', 'Directory to output results to.')
  .parse(process.argv);

if(program.dir !== true && program.dir){
  if(program.category){
    analysisName.listAuthors(program.category, program.dir)
  }
  else if(program.insights && program.author){
    analysisPersonality.analyse(program.author, program.dir);
  }
  else if(!program.person && program.author){
    analysisName.aggregateSentiment(false, program.author, program.dir);
  }
  else if(program.person && !program.author){
    analysisName.aggregateSentiment(program.person, false, program.dir);
  }
  else if(program.person && program.author){
    analysisName.aggregateSentiment(program.person, program.author, program.dir);
  }
}
else{
  console.log('Please specificy a directory');
}
