import { StoryParseNode } from "./storyParseNode";
import { StoryInterpreterC } from "./storyInterpreter";

// TODO: localize strings in this file.

const doubleSlashRegex = /\/\//g;
const ifRegex = /\bif\b/g;
const endIfRegex = /\bendif\b/g;

/** Maps named pages to nodes. */
export interface IPageDictionary {
  [key: string]: StoryParseNode;
}

/**
 * Returns whether the substring formed by the index and length is on the same line as an @ symbol.
 * Does not support nesting.
 */
function isOption(text: string, index: number) {
  let startOfLine = text.substring(0, index).lastIndexOf("\n");

  if (startOfLine === -1) {
    startOfLine = 0;
  }

  let endOfLine = text.substring(index).indexOf("\n");

  if (endOfLine === -1) {
    endOfLine = text.length - 1;
  }

  endOfLine += index;
  const line = text.substring(startOfLine, endOfLine);

  return line.includes("@");
}

/**
 * Returns whether the substring formed by the index and length is in curly brackets in the given
 * text. Does not support nesting.
 */
function isOutput(text: string, index: number) {
  const beforeSubstring = text.substring(0, index);
  const bracketOpenPos = beforeSubstring.lastIndexOf("{");
  const bracketClosePos = beforeSubstring.lastIndexOf("}");

  if (bracketOpenPos < bracketClosePos || bracketOpenPos === -1) {
    return false;
  }

  return true;
}

/** Updates the passed-in interpreter with a node tree for each fork. */
export function parseStory(story: string, interpreter: StoryInterpreterC | null, forkToLoad?: string) {
  const entries: { [key: string]: string } = {};
  const parsed: { [key: string]: StoryParseNode } = {};

  const entryPositions: number[] = [];
  const newlineSplitStory = story.split("\n");

  if (newlineSplitStory.length === 0) {
    interpreter?.setEntries({});
    interpreter?.setErrorMessage("Parser: Story is blank. The story must not be blank to parse it.");
  }

  // Finds fork header positions, normalizes line endings, and removes excess space.
  for (let i = 0; i < newlineSplitStory.length; i++) {
    newlineSplitStory[i] = newlineSplitStory[i].replace("\r", "").trim();

    if (newlineSplitStory[i].startsWith("@")) {
      entryPositions.push(i);
    }
  }

  // Interprets all text up to the first header as game options.
  let header = "";

  if (entryPositions.length > 0) {
    for (let i = 0; i < entryPositions[0]; i++) {
      header += newlineSplitStory[i] + "\n";
    }

    interpreter?.processHeaderOptions(header);
  }

  // Splits entries into a dictionary.
  for (let i = 0; i < entryPositions.length; i++) {
    // Prevents unnamed entries.
    if (newlineSplitStory[entryPositions[i]].length < 2) {
      interpreter?.setErrorMessage(
        "Parser: Entry" + newlineSplitStory[entryPositions[i]] + "must be at least 1 character long."
      );

      continue;
    }

    // Stores the fork header name, content, and content by line.
    let entryName = newlineSplitStory[entryPositions[i]].substring(1);
    let entryList: string[] = [];
    let entry = "";

    // Associates forks with their content.
    if (i === entryPositions.length - 1) {
      entryList = newlineSplitStory.slice(entryPositions[i], newlineSplitStory.length);
    } else {
      entryList = newlineSplitStory.slice(entryPositions[i], entryPositions[i + 1]);
    }

    // Concatenates each line of text.
    for (let j = 1; j < entryList.length; j++) {
      entry += entryList[j] + "\n";
    }

    entryName = entryName.replace(/\s+/g, "").toLowerCase();

    if (entries[entryName] !== undefined) {
      interpreter?.setErrorMessage(`Parser: Entry called '${entryName}' already exists.`);
    } else {
      entries[entryName] = entry;
    }
  }

  // Removes single-line comments from entries.
  const entriesKeys = Object.keys(entries);
  for (let i = 0; i < entriesKeys.length; i++) {
    let isFinished: boolean;
    let entry = entries[entriesKeys[i]];

    do {
      isFinished = true;

      let match: RegExpExecArray | null = null;

      // Determines if candidates are output text or commands.
      while ((match = doubleSlashRegex.exec(entry)) !== null) {
        const pos = match.index;

        // Real comments are removed.
        if (!isOutput(entry, pos) && !isOption(entry, pos)) {
          entry = entry.slice(pos, entry.substring(pos).indexOf("\n"));

          // Comment indices are invalidated. Search again as long as comments might exist (until
          // all are found // instances are output text).
          isFinished = false;
          break;
        }
      }
    } while (!isFinished);

    // Sets the entry.
    entries[entriesKeys[i]] = entry;
  }

  // Creates a parse tree.
  for (let i = 0; i < entriesKeys.length; i++) {
    const root = new StoryParseNode();
    let node = root;
    let depth = 0;

    // The full entry.
    const text = entries[entriesKeys[i]];

    // Finds all if and endif words.
    let ifMatches: RegExpExecArray[] = [];
    let endIfMatches: RegExpExecArray[] = [];
    let match: RegExpExecArray | null = null;
    const ifs: number[] = [];
    const endifs: number[] = [];

    // Determines if candidates are output text or commands.
    while ((match = ifRegex.exec(text)) !== null) {
      ifMatches.push(match);
    }

    while ((match = endIfRegex.exec(text)) !== null) {
      endIfMatches.push(match);
    }

    // Filters out if and endif words that are part of output text.
    for (let j = 0; j < ifMatches.length; j++) {
      if (!isOutput(text, ifMatches[j].index) && !isOption(text, ifMatches[j].index)) {
        ifs.push(ifMatches[j].index);
      }
    }

    for (let j = 0; j < endIfMatches.length; j++) {
      if (!isOutput(text, endIfMatches[j].index) && !isOption(text, endIfMatches[j].index)) {
        endifs.push(endIfMatches[j].index);
      }
    }

    // Ensures the number of if and endif statements match.
    if (ifs.length !== endifs.length) {
      interpreter?.setErrorMessage(
        `Parser: found ${ifs.length} if tokens, but ${endifs.length} ` +
          "endif tokens. Ifs and endifs must match in number."
      );
    }

    // Creates a list of all if and endif statements by index, where ifs are encoded by 0 and endifs by 1.
    let allMatches: { item1: number; item2: number }[] = [];

    for (let j = 0; j < ifs.length; j++) {
      allMatches.push({ item1: ifs[j], item2: 0 });
    }

    for (let j = 0; j < endifs.length; j++) {
      allMatches.push({ item1: endifs[j], item2: 1 });
    }

    // Orders all ifs and endifs in ascending order by index.
    allMatches = allMatches.sort((a, b) => (a.item1 > b.item1 ? 1 : -1));

    // Iterates over all ifs and endifs to create a tree.
    for (let j = 0; j < allMatches.length; j++) {
      // The index, condition, and type (if, endif) of the match.
      let elemBegin = allMatches[j].item1;
      let elemType = allMatches[j].item2;
      let cond = text.substring(elemBegin);
      cond = cond.slice(0, cond.indexOf("\n"));

      // The index and condition of the previous if.
      let prevIfBegin = -1;
      let prevIfCond = "";

      for (let k = j - 1; k >= 0; k--) {
        if (allMatches[k].item2 === 0) {
          prevIfBegin = allMatches[k].item1;
          prevIfCond = text.substring(prevIfBegin);
          prevIfCond = prevIfCond.slice(0, prevIfCond.indexOf("\n"));
          break;
        }
      }

      // The index and condition of the previous endif.
      let prevEndIfBegin = -1;
      let prevEndIfCond = "";

      for (let k = j - 1; k >= 0; k--) {
        if (allMatches[k].item2 === 1) {
          prevEndIfBegin = allMatches[k].item1;
          prevEndIfCond = text.substring(prevEndIfBegin);
          prevEndIfCond = prevEndIfCond.slice(0, prevEndIfCond.indexOf("\n"));
          break;
        }
      }

      // Uses the previous if/endif; whichever is closer.
      let prevElemBegin = prevEndIfBegin > prevIfBegin ? prevEndIfBegin : prevIfBegin;
      let prevElemCond = prevElemBegin === prevEndIfBegin ? prevEndIfCond : prevIfCond;

      // Handles if keywords.
      if (elemType === 0) {
        // Adds text between matched keywords. If text was simply concatenated, it wouldn't preserve order.
        if (j !== 0 && prevIfBegin !== -1) {
          // From if to last if.
          let textNode = new StoryParseNode();
          textNode.parent = node;

          // Determines if the length is negative.
          const prevElemEnd = prevElemBegin + prevElemCond.length;

          if (elemBegin - prevElemEnd < 0) {
            interpreter?.setErrorMessage(
              `Parser: In '${text.substring(prevElemBegin)}', cannot specify multiple if tokens on one line.`
            );

            continue;
          }

          textNode.text += text.substring(prevElemEnd, elemBegin);

          if (!(textNode.children.length === 0 && textNode.condition.trim() === "" && textNode.text.trim() === "")) {
            node.children.push(textNode);
          }
        } else if (elemBegin > 0) {
          // From start of entry to if.
          const textNode = new StoryParseNode();
          textNode.parent = node;
          textNode.text += text.substring(0, elemBegin);

          if (!(textNode.children.length === 0 && textNode.condition.trim() === "" && textNode.text.trim() === "")) {
            node.children.push(textNode);
          }
        }

        // Creates a child node and sets its parent.
        const newChild = new StoryParseNode();
        newChild.parent = node;

        // Adds the found if statement to the conditions list.
        newChild.condition = cond;

        // Adds the child node and moves node to point to it.
        if (!(newChild.children.length === 0 && newChild.condition.trim() === "" && newChild.text.trim() === "")) {
          node.children.push(newChild);
        }

        node = newChild;
        depth++;
      }

      // Handles endif keywords.
      else if (elemType === 1) {
        // The parser always returns since it cannot continue.
        if (depth < 0) {
          interpreter?.setEntries({});
          interpreter?.setErrorMessage("Parser: an extra endif token was encountered (if/endif # " + (j + 1) + ").");

          return;
        }

        // Adds text between matched keywords.
        const textNode = new StoryParseNode();
        textNode.parent = node;

        // Determines if the length is negative.
        const prevElemEnd = prevElemBegin + prevElemCond.length;
        if (elemBegin - prevElemEnd < 0) {
          interpreter?.setErrorMessage(
            "Parser: In '" + text.substring(prevElemBegin) + "', cannot specify multiple endif tokens on one line."
          );

          continue;
        }

        textNode.text += text.substring(prevElemEnd, elemBegin);

        if (!(textNode.children.length === 0 && textNode.condition.trim() === "" && textNode.text.trim() === "")) {
          node.children.push(textNode);
        }

        // Points to the node's parent if possible.
        if (node.parent !== null) {
          node = node.parent;
        } else {
          interpreter?.setEntries({});
          interpreter?.setErrorMessage("Parser: an extra endif token was encountered (endif #" + j + ").");

          return;
        }
      }
    }

    // Adds all text after last if/endif to the first node.
    if (allMatches.length > 0) {
      let lastElemBegin = allMatches[allMatches.length - 1].item1;
      let lastCond = text.substring(lastElemBegin);
      let lastCondLength = lastCond.indexOf("\n");

      /**
       * Since commands must be on their own lines, if there is no newline after the last command,
       * it's the last line in the entry. This means there's nothing after it. So the last
       * condition executes only if this is false.
       */
      if (lastCondLength !== -1) {
        let textNode = new StoryParseNode();
        textNode.parent = root;
        textNode.text += text.substring(lastElemBegin + lastCondLength);

        if (!(textNode.children.length === 0 && textNode.condition.trim() === "" && textNode.text.trim() === "")) {
          root.children.push(textNode);
        }
      }
    } else {
      // Adds all text to the first node in the case that there were no ifs.
      root.text += text;
    }

    // Adds the fully constructed entry.
    parsed[entriesKeys[i]] = root;
  }

  interpreter?.setEntriesWithFork(parsed, forkToLoad ?? "");
}
