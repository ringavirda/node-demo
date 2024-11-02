import { CArgs } from "./cargs";

export interface Command {
  selectors: Array<string>;
  actionAsync: (args: CArgs) => Promise<void>;
}
