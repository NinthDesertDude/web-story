/** Determines how operands interact with an operator token. */
export enum placements {
  /** For unary tokens that use the preceding number, like negation. */
  left,

  /** For unary tokens that use the following number, like factorial. */
  right,

  /** For binary tokens. */
  both,
}
