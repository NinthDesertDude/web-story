import { IToken, tokenEvalFunc } from "./utils";

/** A symbolic token to store a general symbol. */
export class TokenFunc implements IToken {
  public strForm: string;
  public numArgs: number;
  public function: tokenEvalFunc;

  constructor(name: string, numberOfArgs: number, operation: tokenEvalFunc) {
    this.strForm = name;
    this.numArgs = numberOfArgs;
    this.function = operation;
  }

  /** Returns true if all properties of each token are the same. */
  public equals(obj: TokenFunc) {
    return this.strForm === obj.strForm && this.numArgs === obj.numArgs && this.function === obj.function;
  }
}
