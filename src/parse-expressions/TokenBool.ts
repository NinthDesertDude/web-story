import { IToken } from "./utils";

/** A bool token to store a bool literal. */
export class TokenBool implements IToken {
  public strForm: string;
  public value: boolean;

  constructor(value: boolean) {
    this.strForm = value.toString();
    this.value = value;
  }

  /** Returns true if all properties of each token are the same. */
  public equals(obj: TokenBool) {
    return this.strForm === obj.strForm && this.value === obj.value;
  }
}
