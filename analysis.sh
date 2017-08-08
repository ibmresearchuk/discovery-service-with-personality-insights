#!/usr/bin/env node
require('dotenv').config();
var program = require('commander');
var analysisName = require('./analysis-name');
var analysisPersonality = require('./analysis-personality');

program
  .version('1.0.0');

program.command('authors <category> <dir>')
  .action(function (category, dir){
    console.log('list categories %s %s', category, dir);
    analysisName.listAuthors(category, dir)
});

program.command('personality <author> <dir>')
  .action(function (author, dir) {
    console.log('personality %s', dir);
    analysisPersonality.analyse(author, dir);
});

program.command('sentiment <author> <dir>')
  .action(function (author, dir){
    console.log('sentiment %s', dir);
    analysisName.aggregateSentiment(author, dir);
});

program.parse(process.argv);
