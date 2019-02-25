#!/usr/bin/env node
const program = require('commander');
const { prompt } = require('inquirer');
var colors = require('colors');
const inquirer =  require('inquirer');
const consoleApp =  require('inquirer');
const dotenv = require('dotenv').config()


const {
    addQuote, 
    getQuotes, 
    sendQuote
  } = require('./logic');

// Customer Questions
const questions = [
    {
      type: 'input',
      name: 'accName',
      message: 'Customer Name'
    },
    {
      type: 'input',
      name: 'eligibleLives',
      message: 'Customer Eligible Lives'
    },
    {
        type: 'checkbox',
        message: 'Add Products',
        name: 'products',
        choices: ["DENTAL" , "VISION","LTD TRAD" , "STD TRAD"]
    }]; 
  
program 
  .version('1.0.0')
  .description('Broker Management System')


program
  .command('add').alias('a')
  .description('Create a Quote')
  .action(() => {
    inquirer.prompt(questions).then(function(answers) {
        addQuote(answers)
        /*
        OUTPUT :
        [
            {
                name: 'Brendan Eich',
                age: '42',
            }, {
                name: 'Jordan Walke',
                age: '13',
            },
            ...
        ]
        */
    });
  });
program
  .command('listQuotes')
  .alias('l')
  .description('List Quotes')
  .action(() => getQuotes());

program
  .command('send RFP <quoteId>')
  .alias('s')
  .description('Send RFP Request')
  .action((quoteId) => sendQuote(quoteId)); 


program.parse(process.argv);

 
// Assert that a VALID command is provided 
if (!process.argv.slice(2).length || !/[arudl]/.test(process.argv.slice(2))) {
    //program.outputHelp();
    drawMenu() ; 
    //process.exit() ; 
  }


function drawMenu() {
    var consoleMenu = [  
      {
          type: 'list',
          message: 'Choose a command',
          name: 'option',
          choices: ["List Quotes" , "Create a Quote","SEND RFP", "Exit" ]
      }, 
      {
          type: 'input',
          name: 'quoteId',
          message: 'Quote Id',
          when : function( answers ) {
                  return answers.option === "SEND RFP";
                },
          default: "null"
    }]; 
    
    //"\n1.List Quotes\n2.Create a Quote\n3.SEND RFP <quoteId>") ; 
    consoleApp.prompt(consoleMenu).then(function(answers) {  
      switch(answers.option){
        case "List Quotes" :
           getQuotes() ; 
        break ; 
        case "Create a Quote" : 
        inquirer.prompt(questions).then(function(answers) {
            addQuote(answers ) 
        });
        break 
        case "SEND RFP" : 
        if(answers.quoteId){
          sendQuote(answers.quoteId) ;
        }
        else{
          getQuotes() ; 
        }
        break ; 
        case "Exit" : 
          process.exit() ;
        break ;
      }
    });
     


} 



