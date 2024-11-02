import { writeFile } from "fs/promises";
import { accessSync, constants, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { cli } from "./cli.js";
import { PrincessList } from "../../princesses.js";

function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: [...value],
    };
  }
  return value;
}

function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

class PrincessRepo {
  #repoDir = import.meta.dirname;
  #repoFile = "princesses.json";
  #repoPath = join(this.#repoDir, this.#repoFile);

  #state;

  constructor() {
    try {
      accessSync(this.repoPath, constants.F_OK);
      const data = readFileSync(this.repoPath);
      this.#state = JSON.parse(data.toString(), reviver);
    } catch (_) {
      cli.echoWarn(
        "Princess repo is uninitialized. Populating with default values..."
      );
      writeFileSync(this.repoPath, JSON.stringify(PrincessList, replacer));
      this.#state = PrincessList;
    }
  }

  get state() {
    return new Map(this.#state);
  }

  get repoPath() {
    return this.#repoPath;
  }

  async save() {
    await writeFile(this.repoPath, JSON.stringify(this.#state, replacer));
  }

  getCategory(cat) {
    if (this.#state.has(cat)) return this.#state.get(cat);
    else throw new Error(`Unknown category [${cat}].`);
  }

  get(cat, id) {
    const category = this.getCategory(cat);

    const index = parseInt(id);
    if (index < 0 || index >= category.length)
      throw new Error(`Id [${index}] is invalid for category [${cat}].`);
    return category[index];
  }

  #categoryHasPrincess(cat, pr) {
    if (!cat.includes(pr)) throw new Error(`Unknown princess [${pr}].`);
  }

  add(cat, pr) {
    const category = this.getCategory(cat);
    category.push(pr);
    cli.echoSuccess(`Successfully added [${pr}] to category [${cat}]`);
  }

  remove(cat, pr) {
    const category = this.getCategory(cat);

    let index = parseInt(pr);
    if (isNaN(index)) {
      this.#categoryHasPrincess(category, pr);
      index = category.indexOf(pr);
    }
    category.splice(index, 1);
    cli.echoWarn(`[${pr}] is removed from category [${cat}]`);
  }

  change(cat, pr, newPr) {
    const category = this.getCategory(cat);
    this.#categoryHasPrincess(category, pr);
    category[category.indexOf(pr)] = newPr;
    cli.echoWarn(`[${pr} is changed to ${newPr}]`);
  }
}

export const repo = new PrincessRepo();
