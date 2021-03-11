import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';

async function promptForMissingOptions(options) {
 const defaultTemplate = 'HTML';
 if (options.skipPrompts) {
   return {
     ...options,
     template: options.template || defaultTemplate,
   };
 }

 const questions = [];
 if (!options.template) {
   questions.push({
     type: 'list',
     name: 'template',
     message: 'Please choose which project template to use',
     choices: ['JavaScript', 'TypeScript', 'HTML', 'PHP', 'Python'],
     default: defaultTemplate,
   });
 }

 if (!options.git) {
   questions.push({
     type: 'confirm',
     name: 'git',
     message: 'Initialize a git repository?',
     default: false,
   });
 }

 if (!options.expo) {
   questions.push({
    type: 'confirm',
    name: 'expo',
    message: 'Make New expo Project?',
    default: false,
   });
 }

 const answers = await inquirer.prompt(questions);
 return {
   ...options,
   template: options.template || answers.template,
   git: options.git || answers.git,
   expo: options.expo || answers.expo,
 };
}

function parseArgumentsIntoOptions(rawArgs) {
 const args = arg(
   {
     '--git': Boolean,
     '--yes': Boolean,
     '--install': Boolean,
     '--expo': Boolean,
     '-g': '--git',
     '-y': '--yes',
     '-i': '--install',
     '-ex': '--expo',
   },
   {
     argv: rawArgs.slice(2),
   }
 );
 return {
   skipPrompts: args['--yes'] || false,
   git: args['--git'] || false,
   template: args._[0],
   runInstall: args['--install'] || false,
   expo: args['--expo'] || false,
 };
}

export async function cli(args) {
 let options = parseArgumentsIntoOptions(args);
 options = await promptForMissingOptions(options);
 await createProject(options);
 //console.log(options);
}
