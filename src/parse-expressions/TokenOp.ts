import { associativity } from "./Associativity";
import { placements } from "./Placements";
import { IToken, tokenEvalFunc } from "./utils";

/** An operator token. */
export class TokenOp implements IToken {
  public strForm: string;
  public placement: placements;
  public assoc: associativity;
  public prec: number;
  public numArgs: number;
  public function: tokenEvalFunc;

  constructor(
    opPlacement: placements,
    associativity: associativity,
    precedence: number,
    format: string,
    operation: tokenEvalFunc
  ) {
    this.placement = opPlacement;
    this.assoc = associativity;
    this.prec = precedence;

    if (opPlacement === placements.both) {
      this.numArgs = 2;
    } else {
      this.numArgs = 1;
    }

    this.strForm = format;
    this.function = operation;
  }

  /** Returns true if all properties of each token are the same. */
  public equals(obj: TokenOp) {
    return (
      this.strForm === obj.strForm &&
      this.placement === obj.placement &&
      this.assoc === obj.assoc &&
      this.prec === obj.prec &&
      this.numArgs === obj.numArgs &&
      this.function === obj.function
    );
  }
}
