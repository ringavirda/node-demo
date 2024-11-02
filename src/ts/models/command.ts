import { CArgs } from "./cargs";

export interface Command {
  selectors: Array<string>;
  actionAsync: (args: CArgs) => Promise<void>;
}

export class CommandList {}

export const commands: Array<Command> = [];
