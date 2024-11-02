import { randomInt } from "crypto";
import { CArgs } from "../models/cargs";
import { Command } from "../models/command";
import { CLI } from "./cli";
import { Loader } from "./loader";
import { Princess } from "../models/princess";
import { inject, singleton } from "tsyringe";

@singleton()
export class Executor {
  constructor(
    @inject(CLI) private readonly _cli: CLI,
    @inject(Loader) private readonly _loader: Loader
  ) {}

  public async execute(cArgs: CArgs) {
    const command = this._commands.find((c) =>
      c.selectors.includes(cArgs.selector)
    );
    if (command === undefined)
      throw new Error(`Unknown command: ${cArgs.selector}`);

    await command.actionAsync(cArgs);
  }

  private async princessDialogueAsync(commonName: string): Promise<Princess> {
    if (commonName === "") {
      this._cli.echoWarn("Please provide necessary information:");
      commonName = await this._cli.readAsync("Common Name:");
      if (commonName == "")
        throw new Error("Cannot create new princess without a name.");
    } else this._cli.echoWarn("Please provide additional information:");

    const oldName = await this._cli.readAsync("Old Name (optional):");

    const titlesRaw = await this._cli.readAsync(
      "Titles (optional, comma separated):"
    );
    const titles = titlesRaw
      .replace(" ", "")
      .split(",")
      .filter((s) => s != "");

    return {
      commonName: commonName,
      oldName: oldName,
      titles: titles,
    };
  }

  private _commands: Array<Command> = [
    {
      selectors: ["list", "ls"],
      actionAsync: async (cArgs: CArgs) => {
        const categories = this._loader.getCategoryNames();
        if (cArgs.category === "") {
          this._cli.echoSuccess("Displaying available categories:");
          categories.forEach((cat) => this._cli.echo(` - ${cat}`));
        } else {
          const category = this._loader.getCategory(cArgs.category);
          const fullName = this._loader.getCategoryFullName(cArgs.category);
          this._cli.echoSuccess(`Displaying category [${fullName}]:`);
          category.forEach((pr, i) => {
            this._cli.echoInline(`  ${i} - `);
            this._cli.echoPrincess(pr);
          });
        }
      },
    },
    {
      selectors: ["get", "g"],
      actionAsync: async (cArgs: CArgs) => {
        this.argsHaveCategoryAndPrincess(cArgs);
        const princess = this._loader.getPrincess(
          cArgs.category,
          cArgs.princess
        );

        this._cli.echoInline(`Yay! You've selected: `);
        this._cli.echoPrincess(princess);
      },
    },
    {
      selectors: ["getrnd", "gr"],
      actionAsync: async (cArgs: CArgs) => {
        this.argsHaveCategory(cArgs);
        const category = this._loader.getCategory(cArgs.category);

        this._cli.echoWarn("You prey to the RNG powers...");
        this._cli.echoInline("Someone suddenly appeared: ");
        this._cli.echoSuccess(category[randomInt(category.length)].oldName);
      },
    },
    {
      selectors: ["add", "a"],
      actionAsync: async (cArgs: CArgs) => {
        this.argsHaveCategory(cArgs);
        const category = this._loader.getCategory(cArgs.category);

        const newPrincess = await this.princessDialogueAsync(cArgs.princess);
        if (category.find((pr) => pr.commonName === newPrincess.commonName))
          throw new Error(
            `Princess [${newPrincess.commonName}] already exists.`
          );

        this._loader.addPrincess(cArgs.category, newPrincess);
      },
    },
    {
      selectors: ["remove", "rm"],
      actionAsync: async (cArgs: CArgs) => {
        this.argsHaveCategoryAndPrincess(cArgs);
        this._loader.removePrincess(cArgs.category, cArgs.princess);
      },
    },
    {
      selectors: ["change", "ch"],
      actionAsync: async (cArgs: CArgs) => {
        this.argsHaveCategoryAndPrincess(cArgs);
        const princess = this._loader.getPrincess(
          cArgs.category,
          cArgs.princess
        );

        const newPrincess = await this.princessDialogueAsync(
          princess.commonName
        );

        let noChanges = false;
        if (newPrincess.oldName == "") {
          newPrincess.oldName = princess.oldName;
          console.log("Using original [Old Name]");
          noChanges = true;
        }
        if (newPrincess.titles.length === 0) {
          newPrincess.titles = princess.titles;
          console.log("Using original [Titles]");
          if (noChanges) {
            this._cli.echoWarn("No changes, skipping.");
            return;
          }
        }

        this._loader.changePrincess(
          cArgs.category,
          princess.commonName,
          newPrincess
        );
      },
    },
    {
      selectors: ["help", "h"],
      actionAsync: async (_: CArgs) => {
        this._cli.echoSuccess("Supported command signatures:");
        this._cli.echo("  - ls, g, gr, a, rm, ch, h");
      },
    },
  ];

  private argsHaveCategory(cArgs: CArgs): void {
    if (cArgs.category == "")
      throw new Error(
        `Command (${cArgs.selector}) requires princess category as first argument.`
      );
  }

  private argsHavePrincess(cArgs: CArgs): void {
    if (cArgs.princess == "")
      throw new Error(
        `Command (${cArgs.selector}) requires princess name or id as second argument.`
      );
  }

  private argsHaveCategoryAndPrincess(cArgs: CArgs): void {
    this.argsHaveCategory(cArgs);
    this.argsHavePrincess(cArgs);
  }
}
