import { IToken } from "./utils";

/** A numeric token to store an identifer. */
export class TokenId implements IToken {
  public strForm: string;
  public value: number | string | boolean | null;

  constructor(name: string, value: number | string | boolean | null) {
    this.strForm = name;
    this.value = value;
  }

  /** Returns true if all properties of each token are the same. */
  public equals(obj: TokenId) {
    return this.strForm === obj.strForm && this.value === obj.value;
  }
}
