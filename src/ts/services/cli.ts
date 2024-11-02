import * as readline from "readline/promises";
import chalk from "chalk";
import { singleton } from "tsyringe";
import { CArgs } from "../models/cargs";
import { Princess } from "../models/princess";

export class ArgsParser {
  public static parse(rawArgs: String): CArgs {
    const args = rawArgs
      .split(" ")
      .map((s) => s.trim())
      .filter((s) => s != "");

    if (args.length === 0) throw new Error("Nothing was provided!");

    return {
      raw: args,
      selector: args[0],
      category: args.length >= 2 ? args[1] : "",
      princess: args.length >= 3 ? args[2] : "",
    };
  }
}

@singleton()
export class CLI {
  private readonly _cli: readline.Interface;

  constructor() {
    this._cli = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    this._cli.setPrompt("");
  }
  public close(): void {
    this._cli.close();
  }

  public async readAsync(prompt: string): Promise<string> {
    return await this._cli.question(`${prompt} `);
  }

  public echoInline(message: string): void {
    this._cli.write(message);
  }
  public echo(message: string): void {
    this.echoInline(message);
    this.echoInline("\n");
  }
  public echoSuccess(message: string): void {
    this.echo(chalk.green(message));
  }
  public echoWarn(message: string): void {
    this.echo(chalk.yellow(`${chalk.underline("Warn:")} ${message}`));
  }
  public echoError(message: string): void {
    this.echo(chalk.red(`${chalk.underline("Err:")} ${message}`));
  }
  public echoTitle(message: string): void {
    this.echo(chalk.bold.magenta(message));
  }
  public echoPrincess(pr: Princess) {
    this.echo(
      pr.commonName !== pr.oldName
        ? `${chalk.magenta(pr.commonName)} (${chalk.grey(pr.oldName)}):`
        : `${chalk.magenta(pr.commonName)}:`
    );
    this.echo(`\t${chalk.italic(pr.titles.join(", "))}`);
  }
}
