/** Represents a single token for evaluation. */
export interface IToken {
  strForm: string;
}

/**
 * When this function is used, the input numbers can be accessed as an array of objects. As many as
 * provided by the number of arguments may be used.
 */
export type tokenEvalFunc = (tokens: IToken[]) => IToken | null;

/** Matches an integer with optional negative sign in front. */
export const integerRegex = /^-*\d+$/g;

/** Matches a valid decimal number. */
export const numberRegex = /^-?(\d+\.?\d*|\d*\.?\d+)$/g;
