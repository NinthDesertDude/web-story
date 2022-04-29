import { IToken, numberRegex } from "./utils";

/** A numeric token to store a numeric literal. */
export class TokenNum implements IToken {
  public strForm: string;
  public value: number;

  constructor(value: string | number) {
    if (typeof value === "string") {
      this.strForm = value;

      if (!numberRegex.test(value)) {
        throw new Error("Parser: The expression '" + value + "' is not a valid number."); // TODO: localize.
      }

      this.value = parseFloat(value);
    } else {
      this.strForm = value.toString();
      this.value = value;
    }
  }

  /** Returns true if all properties of each token are the same. */
  public equals(obj: TokenNum) {
    return this.strForm === obj.strForm && this.value === obj.value;
  }
}
