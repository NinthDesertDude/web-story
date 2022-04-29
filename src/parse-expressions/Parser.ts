// TODO: localize all errors in this file.

import { associativity } from "./Associativity";
import { placements } from "./Placements";
import { TokenBool } from "./TokenBool";
import { TokenFunc } from "./TokenFunc";
import { TokenId } from "./TokenId";
import { TokenNum } from "./TokenNum";
import { TokenOp } from "./TokenOp";
import { TokenSym } from "./TokenSym";
import { IToken, numberRegex } from "./utils";

/** Tokenizes mathematical expressions to evaluate or symbolically manipulate them. */
export class Parser {
  /** If true, parentheses groups must always be balanced. False by default. */
  public optRequireRightPars = false;

  /** If true, tokens that aren't recognized will be added as unknown variables. True by default. */
  public optIncludeUnknowns = true;

  /**
   * Null identifiers will be replaced with this token for evaluation, if specified. Else, an error
   * will be thrown. Null by default.
   */
  public optUnknownDefault: IToken | null = null;

  /** The sine function for radians. */
  public Fsin = new TokenFunc("sin", 1, (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;

      return new TokenNum(Math.sin(n0.value));
    }

    return null;
  });

  /** The cosine function for radians. */
  public Fcos = new TokenFunc("cos", 1, (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;

      return new TokenNum(Math.cos(n0.value));
    }

    return null;
  });

  /** The tangent function for radians. */
  public Ftan = new TokenFunc("tan", 1, (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;

      return new TokenNum(Math.tan(n0.value));
    }

    return null;
  });

  /** Rounds a single number to the nearest integer. */
  public Frnd = new TokenFunc("round", 1, (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;

      return new TokenNum(Math.round(n0.value));
    }

    return null;
  });

  /** Rounds a number to the nearest multiple of another. */
  public Frnd2 = new TokenFunc("round", 2, (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum && operands[1] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;
      const n1 = operands[1] as TokenNum;

      return new TokenNum(Math.round(n0.value / n1.value) * n1.value);
    }

    return null;
  });

  /** The addition operator. */
  public Add = new TokenOp(placements.both, associativity.left, 6, "+", (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum && operands[1] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;
      const n1 = operands[1] as TokenNum;

      return new TokenNum(n0.value + n1.value);
    }

    return null;
  });

  /** The subtraction operator. */
  public Sub = new TokenOp(placements.both, associativity.left, 6, "-", (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum && operands[1] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;
      const n1 = operands[1] as TokenNum;

      return new TokenNum(n0.value - n1.value);
    }

    return null;
  });

  /** The multiplication operator. */
  public Mlt = new TokenOp(placements.both, associativity.left, 7, "*", (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum && operands[1] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;
      const n1 = operands[1] as TokenNum;

      return new TokenNum(n0.value * n1.value);
    }

    return null;
  });

  /** The division operator. */
  public Div = new TokenOp(placements.both, associativity.left, 7, "/", (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum && operands[1] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;
      const n1 = operands[1] as TokenNum;

      if (n1.value === 0) {
        throw new Error(`Parser: The expression ${n0.strForm} / ${n1.strForm} causes division by zero.`);
      }

      return new TokenNum(n0.value / n1.value);
    }

    return null;
  });

  /** The modulus operator. */
  public Mod = new TokenOp(placements.both, associativity.left, 7, "%", (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum && operands[1] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;
      const n1 = operands[1] as TokenNum;

      if (n1.value === 0) {
        throw new Error(`Parser: The expression ${n0.strForm} % ${n1.strForm} causes division by zero.`);
      }

      return new TokenNum(n0.value % n1.value);
    }

    return null;
  });

  /** The negation operator. */
  public Neg = new TokenOp(placements.right, associativity.right, 8, "-", (operands: IToken[]) => {
    if (operands[1] instanceof TokenNum) {
      const n1 = operands[1] as TokenNum;
      return new TokenNum(-n1.value);
    }

    return null;
  });

  /** The exponentiation operator. */
  public Exp = new TokenOp(placements.both, associativity.right, 8, "^", (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum && operands[1] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;
      const n1 = operands[1] as TokenNum;

      return new TokenNum(Math.pow(n0.value, n1.value));
    }

    return null;
  });

  /** The factorial operator. */
  public Fac = new TokenOp(placements.left, associativity.left, 9, "!", (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;
      let givenVal = n0.value;
      let value = 1;

      while (n0.value > 1) {
        value *= givenVal--;
      }

      return new TokenNum(value);
    }

    return null;
  });

  /** The equality operator. */
  public Eq = new TokenOp(placements.both, associativity.left, 4, "=", (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum && operands[1] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;
      const n1 = operands[1] as TokenNum;

      return new TokenBool(n0.value === n1.value);
    }

    if (operands[0] instanceof TokenBool && operands[1] instanceof TokenBool) {
      const n0 = operands[0] as TokenBool;
      const n1 = operands[1] as TokenBool;

      return new TokenBool(n0.value === n1.value);
    }

    return null;
  });

  /** The inequality operator. */
  public NotEq = new TokenOp(placements.both, associativity.left, 4, "!=", (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum && operands[1] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;
      const n1 = operands[1] as TokenNum;

      return new TokenBool(n0.value !== n1.value);
    }

    if (operands[0] instanceof TokenBool && operands[1] instanceof TokenBool) {
      const n0 = operands[0] as TokenBool;
      const n1 = operands[1] as TokenBool;

      return new TokenBool(n0.value !== n1.value);
    }

    return null;
  });

  /** The greater-than operator. */
  public Gt = new TokenOp(placements.both, associativity.left, 5, ">", (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum && operands[1] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;
      const n1 = operands[1] as TokenNum;

      return new TokenBool(n0.value > n1.value);
    }

    return null;
  });

  /** The greater-than-or-equal operator. */
  public Gte = new TokenOp(placements.both, associativity.left, 5, ">=", (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum && operands[1] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;
      const n1 = operands[1] as TokenNum;

      return new TokenBool(n0.value >= n1.value);
    }

    return null;
  });

  /** The less-than operator. */
  public Lt = new TokenOp(placements.both, associativity.left, 5, "<", (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum && operands[1] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;
      const n1 = operands[1] as TokenNum;

      return new TokenBool(n0.value < n1.value);
    }

    return null;
  });

  /** The less-than-or-equal operator. */
  public Lte = new TokenOp(placements.both, associativity.left, 5, "<=", (operands: IToken[]) => {
    if (operands[0] instanceof TokenNum && operands[1] instanceof TokenNum) {
      const n0 = operands[0] as TokenNum;
      const n1 = operands[1] as TokenNum;

      return new TokenBool(n0.value <= n1.value);
    }

    return null;
  });

  /** The logical not operator. */
  public LogNot = new TokenOp(placements.right, associativity.left, 3, "!", (operands: IToken[]) => {
    if (operands[1] instanceof TokenBool) {
      const n1 = operands[1] as TokenBool;

      return new TokenBool(!n1.value);
    }

    return null;
  });

  /** The logical and operator. */
  public LogAnd = new TokenOp(placements.both, associativity.left, 1, "&", (operands: IToken[]) => {
    if (operands[0] instanceof TokenBool && operands[1] instanceof TokenBool) {
      const n0 = operands[0] as TokenBool;
      const n1 = operands[1] as TokenBool;

      return new TokenBool(n0.value && n1.value);
    }

    return null;
  });

  /** The logical or operator. */
  public LogOr = new TokenOp(placements.both, associativity.left, 2, "|", (operands: IToken[]) => {
    if (operands[0] instanceof TokenBool && operands[1] instanceof TokenBool) {
      const n0 = operands[0] as TokenBool;
      const n1 = operands[1] as TokenBool;

      return new TokenBool(n0.value || n1.value);
    }

    return null;
  });

  /** Represents the literal boolean value of false. */
  public varFalse = new TokenId("false", false);

  /** Represents the literal boolean value of true. */
  public varTrue = new TokenId("true", true);

  /** The mathematical constant, Pi. */
  public varPi = new TokenId("pi", Math.PI);

  /** Represents a left parenthesis. */
  public lPar = new TokenSym("(");

  /** Represents a right parenthesis. */
  public rPar = new TokenSym(")");

  /** Represents a function argument separator. */
  public argSep = new TokenSym(",");

  // prettier-ignore
  /** A list of all tokens to parse with. */
  public tokens: IToken[] = [];

  constructor() {
    this.resetTokens();
  }

  /** Adds a string-lowercased copy of the function. */
  public addFunction(token: TokenFunc) {
    this.tokens.push(new TokenFunc(token.strForm.toLowerCase(), token.numArgs, token.function));
    this.tokens = this.tokens.sort((a, b) => (a.strForm < b.strForm ? 1 : -1));
  }

  /** Adds a string-lowercased copy of the identifier. */
  public addIdentifier(token: TokenId) {
    this.tokens.push(new TokenId(token.strForm.toLowerCase(), token.value));
    this.tokens = this.tokens.sort((a, b) => (a.strForm < b.strForm ? 1 : -1));
  }

  /** Adds a string-lowercased copy of the operator. */
  public addOperator(token: TokenOp) {
    this.tokens.push(
      new TokenOp(token.placement, token.assoc, token.prec, token.strForm.toLowerCase(), token.function)
    );

    // Sorts tokens in reverse lexicographic order to support deferring.
    this.tokens = this.tokens.sort((a, b) => (a.strForm < b.strForm ? 1 : -1));
  }

  /** Parses an expression with operators, functions, and identifiers. */
  public eval(expression: string) {
    return this.evalTokens(this.tokenize(expression));
  }

  /** Parses a pre-tokenized expression. Invalid tokenization may result in unanticipated errors. */
  public evalTokens(tokensList: IToken[]) {
    // Substitutes values for identifiers.
    for (let i = 0; i < tokensList.length; i++) {
      if (tokensList[i] instanceof TokenId) {
        const tokId = tokensList[i] as TokenId;

        // Inserts any known values for a token.
        if (tokId.value !== null) {
          if (typeof tokId.value === "number") {
            tokensList[i] = new TokenNum(tokId.value);
          } else if (typeof tokId.value === "boolean") {
            tokensList[i] = new TokenBool(tokId.value);
          }
        }

        // Replaces unknown identifiers with a value or fails.
        else if (this.optUnknownDefault !== null) {
          tokensList[i] = this.optUnknownDefault;
        } else {
          throw new Error("Parser: The identifier '" + tokensList[i].strForm + "' is unknown and can't be computed.");
        }
      }
    }

    const functions = this.tokens.filter((token) => token instanceof TokenFunc) as TokenFunc[];

    // Solves each parenthesis group from deepest depth outward.
    while (true) {
      // Finds the end of the nearest complete sub-expression.
      let rbrPos = tokensList.indexOf(this.rPar) + 1;
      let subExpressionEnd = rbrPos >= 1 ? rbrPos : tokensList.length;

      // Finds the start of the nearest complete sub-expression.
      let lbrPos = tokensList.slice(0, subExpressionEnd).lastIndexOf(this.lPar);
      let subExpressionBegin = lbrPos >= 0 ? lbrPos : 0;

      // Isolates the sub-expression.
      let expressionLHS = tokensList.slice(0, subExpressionBegin);
      let expressionRHS = tokensList.slice(subExpressionEnd, tokensList.length);
      let subExpression = tokensList.slice(subExpressionBegin, subExpressionEnd);

      // Includes functions and picks a proper overload.
      let subExpressionFunc: TokenFunc | null = null;

      if (expressionLHS[expressionLHS.length - 1] instanceof TokenFunc) {
        const tokFunc = expressionLHS[expressionLHS.length - 1] as TokenFunc;
        expressionLHS.splice(expressionLHS.length - 1, 1);

        let numArgs = 1;

        subExpression.forEach((tok) => {
          if (tok === this.argSep) {
            numArgs++;
          }
        });

        subExpressionFunc = functions.find((f) => f.numArgs === numArgs && f.strForm === tokFunc.strForm) ?? null;
      }

      // Evaluates sub-expressions.
      tokensList = expressionLHS;
      tokensList.push(...this.evalNoPar(subExpression, subExpressionFunc));
      tokensList.push(...expressionRHS);

      // Returns when everything has been parsed.
      if (expressionLHS.length === 0 && expressionRHS.length === 0) {
        let result = "";

        for (let i = 0; i < tokensList.length; i++) {
          result += tokensList[i].strForm;
        }

        return result;
      }
    }
  }

  /**
   * Parses a non-relational expression without parentheses with an optional argument to treat the
   * expression as function arguments.
   */
  public evalNoPar = (subExpression: IToken[], func: TokenFunc | null): IToken[] => {
    let operators = this.tokens.filter((tok) => tok instanceof TokenOp) as TokenOp[];
    let result: IToken[] = [];

    // Creates a string representation of the token list for errors.
    let subExpressionStr = "";

    for (let i = 0; i < subExpression.length; i++) {
      subExpressionStr += subExpression[i].strForm;
    }

    // Strips () and catches empty expressions.
    if (
      this.optRequireRightPars &&
      subExpression[0] === this.lPar &&
      subExpression[subExpression.length - 1] !== this.rPar
    ) {
      throw new Error("Parser: The expression '" + subExpressionStr + "' is missing a right parenthesis at the end.");
    }

    subExpression.filter((tok) => tok === this.lPar || tok === this.rPar);

    if (subExpression.length === 0) {
      throw new Error("Parser: an empty parenthesis group was provided; there is nothing to process within it.");
    }

    // Parses each argument separately, then applies the function.
    if (func !== null) {
      let args = this.split(subExpression, this.argSep);
      let argVals: IToken[] = [];

      // Catches overloads with the wrong number of arguments.
      if (func.numArgs !== args.length) {
        throw new Error(
          "Parser: In expression '" +
            subExpressionStr +
            "', the number of arguments for " +
            func.strForm +
            " should be " +
            func.numArgs +
            ", but " +
            args.length +
            " arguments were given."
        );
      }

      // Simplifies each argument.
      for (let i = 0; i < args.length; i++) {
        const subResult = this.evalNoPar(args[i], null);

        if (subResult[0] instanceof TokenNum || subResult[0] instanceof TokenBool) {
          argVals[i] = subResult[0];
        } else {
          throw new Error(
            "Parser: In expression '" +
              subExpressionStr +
              "', a boolean argument was provided instead of a decimal value."
          );
        }
      }

      // Applies functions.
      const immediateResult = func.function(argVals);
      if (immediateResult === null) {
        throw new Error(
          "Parser: In expression '" + subExpressionStr + "', arguments do not match parameter types used."
        );
      }

      result.push(immediateResult);
      return result;
    }

    // Minuses are binary by default; determines which ones are unary. If the first token is a
    // minus, it's a negation.
    if (subExpression[0] === this.Sub) {
      subExpression[0] = this.Neg;
    }

    // Performs left-to-right modifications on the token list.
    for (let i = 1; i < subExpression.length; i++) {
      // A minus after a binary operator or negation is a negation.
      if (
        (subExpression[i] === this.Sub &&
          subExpression[i - 1] instanceof TokenOp &&
          ((subExpression[i - 1] as TokenOp).numArgs > 1 || subExpression[i - 1] === this.Neg)) ||
        subExpression[i - 1] instanceof TokenFunc
      ) {
        subExpression[i] = this.Neg;
      }
    }

    // Gets max precedence within sub-expression.
    let opTokens = subExpression.filter((tok) => tok instanceof TokenOp) as TokenOp[];

    let maxPrecedence = 0;
    opTokens.forEach((tok: TokenOp) => {
      if (tok.prec > maxPrecedence) {
        maxPrecedence = tok.prec;
      }
    });

    // Computes all operators with equal precedence.
    while (maxPrecedence > 0) {
      let isRightAssociative = operators.some((tok) => maxPrecedence === tok.prec && tok.assoc === associativity.right);

      // Iterates through each token forwards or backwards.
      let j = isRightAssociative ? subExpression.length - 1 : 0;

      while ((isRightAssociative && j >= 0) || (!isRightAssociative && j < subExpression.length)) {
        if (subExpression[j] instanceof TokenOp && (subExpression[j] as TokenOp).prec === maxPrecedence) {
          let opToken = subExpression[j] as TokenOp;
          let argVals: IToken[] = [subExpression[j - 1] ?? null, subExpression[j + 1] ?? null];
          let result: IToken | null = null;

          // Handles missing arguments.
          if (argVals[0] === null && (opToken.placement === placements.both || opToken.placement === placements.left)) {
            throw new Error(
              "Parser: In '" +
                subExpressionStr +
                "', the '" +
                subExpression[j].strForm +
                "' operator is missing a lefthand operand."
            );
          } else if (
            argVals[1] === null &&
            (opToken.placement === placements.both || opToken.placement === placements.right)
          ) {
            throw new Error(
              "Parser: In '" +
                subExpressionStr +
                "', the '" +
                subExpression[j].strForm +
                "' operator is missing a righthand operand."
            );
          }

          // Applies each operator.
          result = opToken.function(argVals);

          // Removes affected tokens and inserts new value.
          if (result === null) {
            throw new Error("In expression '" + subExpressionStr + "', operand type(s) do not match operator.");
          } else {
            subExpression[j] = result;
          }

          if (opToken.placement === placements.left) {
            subExpression.splice(j - 1, 1);
            j += isRightAssociative ? 0 : -1;
          } else if (opToken.placement === placements.right) {
            subExpression.splice(j + 1, 1);
            j += isRightAssociative ? 1 : 0;
          } else if (opToken.placement === placements.both) {
            subExpression.splice(j + 1, 1);
            subExpression.splice(j - 1, 1);
            j += isRightAssociative ? 0 : -1;
          }
        }

        // Moves to next token to evaluate.
        if (isRightAssociative) {
          j--;
        } else {
          j++;
        }
      }

      // Gets new precedence within sub-expression.
      opTokens = subExpression.filter((tok) => tok instanceof TokenOp) as TokenOp[];
      let maxPrecedence2 = 0;

      opTokens.forEach((tok: TokenOp) => {
        if (tok.prec > maxPrecedence2) {
          maxPrecedence2 = tok.prec;
        }
      });
    }

    // Returns the final value.
    result.push(...subExpression);
    return result;
  };

  /** Returns the list of all tokens in use. */
  public getTokens() {
    return this.tokens;
  }

  /**
   * Removes the first match for the given token from the list of tokens, if it exists. Returns
   * true if found, false otherwise.
   */
  public removeToken(token: IToken) {
    for (let i = this.tokens.length; i > 0; i--) {
      if ((token as TokenBool).equals((this.tokens as TokenBool[])[i])) {
        this.tokens.splice(i, 1);

        return true;
      }
    }

    return false;
  }

  /** Resets to the default token list and removes all user-added tokens. */
  public resetTokens() {
    //Sets the token list. Omits factorial.
    //prettier-ignore
    this.tokens = [
      this.Exp, this.Neg, this.Mod, this.Div, this.Mlt, this.Sub, this.Add, this.LogNot, this.LogOr, this.LogAnd,
      this.Eq, this.Gt, this.Gte, this.Lt, this.Lte, this.NotEq,
      this.Fsin, this.Fcos, this.Ftan, this.Frnd, this.Frnd2,
      this.varFalse, this.varTrue, this.varPi,
      this.lPar, this.rPar, this.argSep
    ];

    //Sorts tokens in reverse lexicographic order to support deferring.
    this.tokens = this.tokens.sort((a, b) => (a.strForm < b.strForm ? 1 : -1));
  }

  /**
   * Returns all consecutive items between each matched delimiter item. For example, a list
   * containing [0, 2, 1, 3, 1] delimited by 1 will return the lists [0, 2][3].
   */
  public split<T>(list: T[], delimiter: T): T[][] {
    const lists: T[][] = [];
    const currentList: T[] = [];

    // Stores the running list and creates another for each delimiter.
    for (let i = 0; i < list.length; i++) {
      if (list[i] === delimiter) {
        lists.push([...currentList]);
      } else {
        currentList.push(list[i]);
      }
    }

    if (currentList.length > 0) {
      lists.push(currentList);
    }

    return lists;
  }

  /** Converts the given string to tokens. */
  public tokenize(expression: string): IToken[] {
    const tokensList: IToken[] = [];
    let token = "";

    // Catches null or whitespace strings.
    if (expression.trim() === "") {
      throw new Error("Parser: No expression provided.");
    }

    // Lowercases and removes whitespaces.
    expression = expression.replace(/\s/gm, "").toLowerCase();

    // Builds a token list.
    let longestMatch: IToken | null = null;
    let shortestMatch: IToken | null = null;
    let candidateBeforeDefer: IToken | null = null;

    for (let i = 0; i < expression.length; i++) {
      token += expression[i];

      // Matches longer tokens and tokens of the same length.
      longestMatch = this.tokens.filter((tok) => tok.strForm === token)[0];

      // Defers when the token is longer.
      if (i !== expression.length - 1 && longestMatch?.strForm.length > token.length) {
        shortestMatch = this.tokens.filter((tok) => tok.strForm === token)[0];

        // Stores valid matches as token matching is deferred.
        if (shortestMatch?.strForm === token) {
          candidateBeforeDefer = shortestMatch;

          // Adds the token if at end rather than deferring.
          if (i === expression.length - 1) {
            tokensList.push(shortestMatch);
            token = "";
            candidateBeforeDefer = null;
          }
        }
      }

      // Matches when there are no longer candidates.
      else if (longestMatch !== null && (i !== expression.length - 1 || longestMatch.strForm.length === token.length)) {
        tokensList.push(longestMatch);
        token = "";
        candidateBeforeDefer = null;
      } else {
        // Backtracks to the last valid token.
        if (candidateBeforeDefer !== null) {
          i -= token.length - candidateBeforeDefer.strForm.length;
          tokensList.push(candidateBeforeDefer);
          token = "";
          candidateBeforeDefer = null;
        }

        // Matches literals.
        else if (numberRegex.test(token)) {
          const val = parseFloat(token);

          // Adds the numeric token at end of string or boundary.
          if (i === expression.length - 1 || !numberRegex.test(token + expression[i + 1])) {
            tokensList.push(new TokenNum(val));
            token = "";
          }
        }

        // Matches unknowns by-character if allowed.
        else if (this.optIncludeUnknowns) {
          tokensList.push(new TokenId(token[0].toString(), null));
          i -= token.length - 1;
          token = "";
        } else {
          throw new Error("Parser: token '" + token + "' is not a recognized symbol.");
        }
      }
    }

    // Combines contiguous tokens. If the resulting token exists, uses it. Else, adds as unknown or
    // throws an error.
    let combinedTokens: IToken[] = [];
    let unknownTokenName = "";

    // Combines contiguous unknowns. Sets tokens to be subtraction rather than negation by default.
    for (let i = 0; i < tokensList.length; i++) {
      // Break and add while looking ahead.
      if (
        i === tokensList.length - 1 ||
        tokensList[i + 1] instanceof TokenOp ||
        tokensList[i + 1] instanceof TokenSym
      ) {
        if (unknownTokenName !== "") {
          unknownTokenName += tokensList[i].strForm;

          if (this.optIncludeUnknowns) {
            combinedTokens.push(new TokenId(unknownTokenName, null));
            unknownTokenName = "";
            continue;
          } else {
            throw new Error("Parser: token '" + unknownTokenName + "' is not a recognized symbol.");
          }
        }
      }

      // Append.
      else if (!(tokensList[i] instanceof TokenOp || tokensList[i] instanceof TokenSym)) {
        if (unknownTokenName !== "" || !(tokensList[i] instanceof TokenNum)) {
          unknownTokenName += tokensList[i].strForm;
          continue;
        }
      }

      // Add other tokens, favoring subtraction over negation.
      if (tokensList[i] === this.Neg) {
        combinedTokens.push(this.Sub);
      } else {
        combinedTokens.push(tokensList[i]);
      }
    }

    return combinedTokens;
  }
}
