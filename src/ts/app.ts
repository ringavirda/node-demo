import "reflect-metadata";
import { container, inject, singleton } from "tsyringe";
import { CLI, ArgsParser } from "./services/cli";
import { Loader } from "./services/loader";
import { Executor } from "./services/executor";
import { StartRequest } from "./models/startRequest";

@singleton()
class App {
  constructor(
    @inject(CLI) private readonly _cli: CLI,
    @inject(Loader) private readonly _loader: Loader,
    @inject(Executor) private readonly _exec: Executor
  ) {}

  public async run(request: StartRequest) {
    request.helloLines.forEach((l) => this._cli.echoTitle(l));
    await this._loader.loadAsync();

    while (true) {
      const line = await this._cli.readAsync(request.promptSymbol);
      const cArgs = ArgsParser.parse(line);

      if (request.quitSelectors.includes(cArgs.selector)) {
        await this._loader.saveAsync();
        request.goodbyLines.forEach((l) => this._cli.echoTitle(l));
        this._cli.close();
        return;
      }

      try {
        await this._exec.execute(cArgs);
      } catch (error: any) {
        this._cli.echoError(error.message);
      }
    }
  }
}

const app = container.resolve(App);
await app.run({
  helloLines: [
    "Princess selector CLI!",
    "Use (help) to see command list, or (q) to exit.",
  ],
  goodbyLines: ["Fallenstar is always watching..."],
  promptSymbol: "->",
  quitSelectors: ["exit", "quit", "q"],
});
