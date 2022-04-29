/** Represents which direction to evaluate multiple homogenous operators in. */
export enum associativity {
  /** Left associative operators compute a ~ b ~ c as (a ~ b) ~ c. */
  left,

  /** Right associative operators compute a ~ b ~ c as a ~ (b ~ c). */
  right,
}
