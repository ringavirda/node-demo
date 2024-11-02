export interface CArgs {
  raw: Array<string>;
  // Most commands use this convention.
  selector: string;
  category: string;
  princess: string;

  // Options may be added here.
}
