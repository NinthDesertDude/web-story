import { IToken } from "./utils";

/** A symbolic token to store a general symbol. */
export class TokenSym implements IToken {
  public strForm: string;

  constructor(name: string) {
    this.strForm = name;
  }

  /** Returns true if all properties of each token are the same. */
  public equals(obj: TokenSym) {
    return this.strForm === obj.strForm;
  }
}
