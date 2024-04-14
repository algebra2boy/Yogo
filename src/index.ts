#!/usr/bin/env node

import { program } from "commander";

program
  .version("1.0.0")
  .description("My Node CLI")
  .option("-n, --name <type>", "Add your name")
  .action((options) => {
    console.log(`Hey, ${options.name}!`);
    console.log("I love it");
    console.log("I love it very much");
    console.log("I love it very much");
  });

program.parse(process.argv);