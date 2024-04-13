import { program } from "commander";

program
  .version("0.1.0")
  .description("Yogo is a command line tool for generating daily life tasks.")

program
  .command('say-hello')
  .description('Say hello to the world')
  .action(() => {
    console.log('Hello world!');
  })