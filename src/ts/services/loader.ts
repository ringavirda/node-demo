import { access, constants, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { KnownPrincesses, Princess, PrincessMap } from "../models/princess";
import { CLI } from "./cli";
import { inject, singleton } from "tsyringe";

class MapFixes {
  public static replacer(key: any, value: any): any {
    if (value instanceof Map) {
      return {
        dataType: "Map",
        value: [...value],
      };
    }
    return value;
  }

  public static reviver(key: any, value: any): any {
    if (typeof value === "object" && value !== null) {
      if (value.dataType === "Map") {
        return new Map(value.value);
      }
    }
    return value;
  }
}

@singleton()
export class Loader {
  private _dirName = "data";
  private _fileName = "princesses.json";
  private _path = join(
    import.meta.dirname,
    "..",
    this._dirName,
    this._fileName
  );

  constructor(@inject(CLI) private readonly _cli: CLI) {
    this._state = KnownPrincesses;
  }

  private _state: PrincessMap;

  public async loadAsync(): Promise<void> {
    try {
      await access(this._path, constants.F_OK);
      const data = await readFile(this._path);
      this._state = JSON.parse(data.toString(), MapFixes.reviver);
    } catch (_) {
      this._cli.echoWarn(
        "Princess repo is uninitialized. Populating with default values..."
      );
      await this.saveAsync();
    }
  }

  public async saveAsync(): Promise<void> {
    writeFile(this._path, JSON.stringify(this._state, MapFixes.replacer));
  }

  public getCategoryFullName(cat: string): string {
    const category = this._state
      .entries()
      .find((category) => category[0].startsWith(cat));
    if (category === undefined) throw new Error(`Unknown category [${cat}].`);
    return category[0];
  }

  public getCategoryNames(): Array<string> {
    return [...this._state.keys()];
  }

  public getCategory(cat: string): Array<Princess> {
    const fullName = this.getCategoryFullName(cat);
    return this._state.get(fullName) as Array<Princess>;
  }

  // Other category methods may be added here.

  public getPrincess(cat: string, name: string): Princess {
    const category = this.getCategory(cat);
    const index = parseInt(name);

    // Name route.
    if (isNaN(index)) {
      const princess = category.find(
        (pr) => pr.commonName.toLowerCase() === name.toLowerCase()
      );
      if (princess === undefined)
        throw new Error(`Unknown princess [${name}].`);
      return princess;
    }
    // Id route.
    else {
      if (index < 0 || index >= category.length)
        throw new Error(`Id [${index}] is invalid for category [${cat}].`);

      return category[index];
    }
  }

  public addPrincess(cat: string, pr: Princess): void {
    const category = this.getCategory(cat);
    const fullName = this.getCategoryFullName(cat);
    category.push(pr);
    this._cli.echoSuccess(
      `Successfully added [${pr.commonName}] to category [${fullName}]`
    );
  }

  public removePrincess(cat: string, name: string): void {
    const category = this.getCategory(cat);
    const fullName = this.getCategoryFullName(cat);
    const princess = this.getPrincess(cat, name);

    const index = category.indexOf(princess);
    category.splice(index, 1);
    this._cli.echoWarn(
      `[${category[index].commonName}] is removed from category [${fullName}]`
    );
  }

  public changePrincess(cat: string, name: string, newPr: Princess): void {
    const category = this.getCategory(cat);
    const princess = this.getPrincess(cat, name);
    category[category.indexOf(princess)] = newPr;
    this._cli.echoWarn(`[${newPr.commonName}] is changed to:`);
    this._cli.echoPrincess(newPr);
  }
}
