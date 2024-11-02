import * as readline from "readline/promises";
import process from "process";
import { getRndPrincess } from "../princesses.js";

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const echo = (message) => cli.write(`${message}\n`);
const echoDraw = (princess) => echo(`\n${princess} has selected you!`);

const prompt = `
Commands:
  <y> - rnd young one
  <e> - rnd old one
  <q> - exit
> `;

export const runReadline = async () => {
  while (true) {
    const command = await cli.question(prompt);

    if (command === "e") echoDraw(getRndPrincess("elder"));
    else if (command === "y") echoDraw(getRndPrincess("young"));
    else if (command === "q") {
      cli.close();
      return;
    } else echo("\nUnknown command - try again.");
  }
};
