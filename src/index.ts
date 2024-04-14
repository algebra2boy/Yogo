#!/usr/bin/env node

import { Command } from "commander";
import { openSite } from "./commands/openSite.js";

const program = new Command();

program
  .name("yogo")
  .version("v1.0.0", "-v, --version", "Output the current version")
  .description("A simple CLI for accelerating your development process")
  .helpCommand(true); // Add help flag


openSite(program);

// parse the command line arguments
program.parse(process.argv);
