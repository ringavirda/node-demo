import process from "process";
import { getRndPrincess } from "../princesses.js";

const echoInline = (message) => process.stdout.write(message);
const echo = (message) => {
  if (message !== undefined) echoInline(message);
  echoInline("\n");
};
const echoDraw = (princess) => echo(`\n${princess} has selected you!`);

const prompt = () =>
  echoInline(`
Commands: 
  <y> - rnd young one 
  <e> - rnd old one 
  <q> - exit
> `);

export const runEventIO = () => {
  process.stdin.on("data", (chunk) => {
    const command = chunk.toString().toLowerCase().trim();
    echo();

    if (command === "y") echoDraw(getRndPrincess("young"));
    else if (command === "e") echoDraw(getRndPrincess("elder"));
    else if (command === "q") process.exit(0);
    else echo("Unknown command - try again.");

    prompt();
  });

  prompt();
};
