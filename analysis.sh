#!/usr/bin/env node
require('dotenv').config();
var program = require('commander');
var analysisName = require('./analysis-name');
var analysisQuotes = require('./analysis-quotes');
var analysisPersonality = require('./analysis-personality');

program
  .version('1.0.0')
  .description('Cognitive analysis of Watson Discovery News data.')
  .option('-n, --person [person]', 'Athlete name.')
  .option('-d, --dir [dir]', 'Directory to output results to.')
  .option('-q, --quotes [quotes]', 'Use Watson Discovery Service to find quotes.')
  .option('-p, --personality [personality]', 'Use Watson Personality Insights.')
  .parse(process.argv);

if(program.dir !==true && program.dir){
  if(program.person !==true && program.person){
    if (program.quotes){
      if(program.personality){
        analysisPersonality.analyse(program.person, program.dir);
      } else {
         analysisQuotes.analyse(program.person, program.dir);
      }
    } else if(program.personality){
      console.log('Error: Please supply both -p and -q flags to use Watson Personality Insights.' );
    } else {
        analysisName.analyse(program.person, program.dir);
    }
  }
  else{
    console.log('Error: Athlete name needs to be specified using the -n flag.  e.g. ./anaysis.sh -n murray');
    console.log('Or use -h for help.');

  }
}
else{
  console.log('Please specificy a directory');
}
