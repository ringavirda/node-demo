import process from "process";
import * as readline from "readline/promises";
import chalk from "chalk";

class CLI {
  #cli = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  async start(request) {
    request.hello ??=
      "Default Greeting Message.\nWrite (exit) to stop execution.";
    request.prompt ??= ">";
    request.quit ??= ["exit"];

    this.echo(chalk.bold.magenta(request.hello));

    while (true) {
      const line = await this.#cli.question(`${request.prompt} `);
      const args = line
        .split(" ")
        .map((s) => s.trim())
        .filter((s) => s != "");

      if (args.length === 0) this.echoError("Nothing was provided!");
      else {
        const selector = args.splice(0, 1)[0];
        if (request.quit.includes(selector)) {
          this.#cli.close();
          return;
        }
        request.callback(selector, args);
      }
    }
  }

  echoInline(message) {
    process.stdout.write(message);
  }
  echo(message) {
    this.echoInline(message);
    this.echoInline("\n");
  }
  echoSuccess(message) {
    this.echo(chalk.green(message));
  }
  echoWarn(message) {
    this.echo(chalk.yellow(`${chalk.underline("Warn:")} ${message}`));
  }
  echoError(message) {
    this.echo(chalk.red(`${chalk.underline("Err:")} ${message}`));
  }
}

export const cli = new CLI();
