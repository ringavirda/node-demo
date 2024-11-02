import { cli } from "./cli.js";
import { CommandList } from "./commands.js";
import { repo } from "./repo.js";

const commandPump = (selector, args) => {
  const command = CommandList.find((c) => c.selectors.includes(selector));
  if (command === undefined) {
    cli.echoError(`Unknown command: ${selector}`);
    return;
  } else if (command.action.length !== args.length) {
    cli.echoError(
      `Incorrect amount of args for (${selector}), should be ${command.action.length}.`
    );
    return;
  }

  try {
    command.action(...args);
  } catch (error) {
    cli.echoError(error.message);
  }
};

export const runCrud = async () => {
  await cli.start({
    hello:
      "Princess selector CLI!\nUse (help) to see command list, or (q) to exit.",
    prompt: "->",
    quit: ["exit", "quit", "q"],
    callback: commandPump,
  });
  await repo.save();
};
