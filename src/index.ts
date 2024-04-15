#!/usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import chalk from "chalk";

import { openSite } from "./commands/openSite/openSite.js";
import { contribution } from "./commands/contributions/checkContribution.js";

const program = new Command();

// cool ASCII character
console.log(
  chalk.blueBright(figlet.textSync("YOGO", {
    font: "3D-ASCII",
    width: 100,
    whitespaceBreak: true
  }))
);

program
  .name("yogo")
  .version("v1.0.0", "-v, --version", "Output the current version")
  .description("A simple CLI for accelerating your development process")
  .helpCommand(true); // Add help flag


openSite(program);
contribution(program);

// parse the command line arguments
program.parse(process.argv);
