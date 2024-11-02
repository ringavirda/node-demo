import { cli } from "./cli.js";
import { repo } from "./repo.js";

export const CommandList = [
  {
    selectors: ["list", "ls"],
    action: (category) => {
      const list = repo.getCategory(category);
      if (list !== null) {
        cli.echoSuccess(`Displaying category [${category}]:`);
        list.forEach((pr, i) => cli.echo(`  ${i} - ${pr}`));
      }
    },
  },
  {
    selectors: ["get", "g"],
    action: (category, prIndex) => {
      const pr = repo.get(category, prIndex);
      if (pr !== null) {
        cli.echoInline(`Yay! You've selected: `);
        cli.echoSuccess(pr);
      }
    },
  },
  {
    selectors: ["getrnd", "gr"],
    action: (category) => {
      const list = repo.getCategory(category);
      if (list !== null) {
        cli.echoWarn("You prey to the RNG powers...");
        return list[randomInt(list.length)];
      }
    },
  },
  {
    selectors: ["add", "a"],
    action: (category, newName) => {
      repo.add(category, newName);
    },
  },
  {
    selectors: ["remove", "rm"],
    action: (category, name) => {
      repo.remove(category, name);
    },
  },
  {
    selectors: ["change", "ch"],
    action: (category, name, newName) => {
      repo.change(category, name, newName);
    },
  },
  {
    selectors: ["help", "h"],
    action: () => {
      cli.echoSuccess("Supported command signatures:");
      cli.echo("  - ls, g, gr, a, rm, ch, h");
    },
  },
];
