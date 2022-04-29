import * as React from "react";
import { StoryParseNode } from "./storyParseNode";
import { IPageDictionary } from "./storyParser";
import {
  idRunnerContent,
  idRunnerInputfield,
  idRunnerLog,
  idRunnerOptions,
  idRunnerOptionRestart,
  idRunnerWrapper,
  idRunnerInputElement,
  idRunnerOutputElement,
  idRunnerOptionElement,
} from "../common/identifiers";
import { IRootState } from "../store";
import { connect } from "react-redux";
import { dispatchRerenderStory } from "../gui/editor/viewedit.reducers";
import { Dispatch } from "redux";
import { runnerWrapperStyle, runnerOutputWrapperStyle, fallbackFontStack } from "../common/styles/controlStyles";
import { ThemeTypes } from "../common/themes";
import { ActionButton } from "@fluentui/react/lib/components/Button/ActionButton/ActionButton";
import { MessageBarType } from "@fluentui/react/lib/components/MessageBar/MessageBar.types";
import { MessageBar } from "@fluentui/react/lib/components/MessageBar/MessageBar";
import { numberRegex } from "../parse-expressions/utils";
import { Parser } from "../parse-expressions/Parser";
import { TokenBool } from "../parse-expressions/TokenBool";
import { TokenFunc } from "../parse-expressions/TokenFunc";
import { TokenId } from "../parse-expressions/TokenId";
import { TokenNum } from "../parse-expressions/TokenNum";
import { ITextStyle } from "../common/redux/typedefs";
import { dispatchSetTempStoryRunnerOptions } from "../gui/editor-settings-page/currentRunnerSettings.reducers";
import { dispatchSetAuthorStoryRunnerStyles } from "../gui/editor-settings-page/authorStorySettings.reducers";
import { Random } from "../common/random";
import { fallbackElementType, getTextStyle } from "../common/styles/interpreterStyles";
import { TextField } from "@fluentui/react/lib/components/TextField/TextField";
import { getStrings } from "../common/localization/Localization";

// TODO: localize strings in this file.

let uniqueKeyCounter = Number.MIN_SAFE_INTEGER;

const whitespaceRegex = /\s+/gm;
const colorRegex = /^[0-9|a-f]+$/g;
const singleDigitRegex = /[0-9]/g;
const escapeBraceRegex = /\\at|\\lb|\\rb|\\n|\\s/g;
const escapeNoBraceRegex = /\\at|\\n|\\s/g;

/** An expression parser used by the interpreter to resolve expressions for variable assignments. */
const exprParser = new Parser();
let random: Random | undefined;

/** A dictionary of all variables in the current game. */
interface IVariables {
  [key: string]: number | boolean | string;
}

/**
 * Returns an element that reads from the current state so it updates with theme changes. In being function-based, it's
 * only recomputed when the element is evaluated.
 */
type InterpreterNode = (props: CombinedProps) => JSX.Element;

const mapStateToProps = (state: IRootState) => {
  return {
    authorStorySettings: state.authorStorySettings,
    currentStorySettings: state.currentRunnerSettings,
    playerStorySettings: state.playerStorySettings,
    renderTrigger: state.viewEdit.storyRerenderToken, // Needed to re-render after output/input/options change.
    strings: getStrings(state.settings.locale),
    theme: state.settings.theme,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    dispatchRerenderStory: dispatchRerenderStory(dispatch),
    dispatchSetAuthorStoryRunnerStyles: dispatchSetAuthorStoryRunnerStyles(dispatch),
    dispatchSetTempStoryRunnerOptions: dispatchSetTempStoryRunnerOptions(dispatch),
  };
};

type StoryInterpreterOwnProps = {
  debugging?: boolean;
};

type CombinedProps = StoryInterpreterOwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class StoryInterpreterC extends React.Component<StoryInterpreterOwnProps> {
  /** Tracks actions so they can be removed when navigating other forks/files. */
  private actions: ((text: string) => void)[] = [];

  /** The content of the current page. */
  private content: InterpreterNode[] = [];

  /** The content of the current page after evaluating each item with current theme values. */
  private contentCached: JSX.Element[] = [];

  /** Story styling of options that are created. Styling precedence is player > story > author. */
  private currentOptionStyles: ITextStyle = {};

  /** Story styling of options when they are highlighted. Styling precedence is player > story > author. */
  private currentOptionHighlightStyles: ITextStyle = {};

  /** Story styling of output that gets created. Styling precedence is player > story > author. */
  private currentOutputStyles: ITextStyle = {};

  /** Stores all tree entries. */
  private entries: IPageDictionary = {};

  /** An optional error message that displays in a top banner when non-empty. */
  private errorMessage = "";

  /** Stores the current page by name. */
  private fork = "";

  /** Keeps a list of all previous content, if not disabled. */
  private log: InterpreterNode[] = [];

  /** Keeps a list of all previous content after evaluating each item with current theme values, if not disabled. */
  private logCached: JSX.Element[] = [];

  /** Hyperlink options to the next page. */
  private options: InterpreterNode[] = [];

  /** Hyperlink options to the next page, evaluated with current theme values. */
  private optionsCached: JSX.Element[] = [];

  /** Used to stop evaluation of the current fork entirely. */
  private stopEvaluation = false;

  /** Whether to display a textbox or not. It's displayed automatically when the user can enter text. */
  private textboxHidden = true;

  /** Tracked so they can be stopped when navigating other forks/files. */
  private timers: NodeJS.Timeout[] = [];

  /** Defines a place for generated variables to be stored and accessed. */
  private variables: IVariables = {};

  /** Stores a copy of all variables as they were just before visiting a new page. This is used when saving. */
  private variablesPrev: IVariables = {};

  /** The restart link for when a page is empty or the link is forcibly shown. */
  private getRestartLink = () => {
    const combinedProps = this.props as CombinedProps;

    return this.addOption(
      combinedProps.authorStorySettings.authorStoryStrings.restartLinkText || combinedProps.strings.RunnerRestart,
      this.restartGame,
      idRunnerOptionRestart
    );
  };

  constructor(props: StoryInterpreterOwnProps) {
    super(props);
    this.refreshInterpreter();
  }

  public shouldComponentUpdate(nextProps: Readonly<StoryInterpreterOwnProps>) {
    const newProps = nextProps as CombinedProps;

    // Update random if necessary.
    if (!random || newProps.authorStorySettings.authorStoryRunnerOptions.randomSeed !== random.seed) {
      random = new Random(newProps.authorStorySettings.authorStoryRunnerOptions.randomSeed);
    }

    // Recompute cached versions of all components.
    this.contentCached = this.content.map((node: InterpreterNode) => node(newProps));
    this.logCached = this.log.map((node: InterpreterNode) => node(newProps));
    this.optionsCached = this.options.map((node: InterpreterNode) => node(newProps));

    return true;
  }

  /**
   * Creates and returns a text element styled to represent the player's input. It's prefixed according to whether it
   * was created from a hyperlink or by typing.
   */
  public addInput(text: string, fromOption?: true) {
    return (props: CombinedProps) => {
      const prefix = fromOption
        ? props.authorStorySettings.authorStoryStrings.inputOptionPrefixText || "• "
        : props.authorStorySettings.authorStoryStrings.inputTextboxPrefixText || "→ ";

      console.log(
        JSON.stringify(
          getTextStyle(
            props.theme,
            !props.debugging ? props.playerStorySettings.playerStoryInputStyles : {},
            {}, // can't pass styles
            props.authorStorySettings.authorStoryInputStyles,
            fallbackElementType.input
          )
        )
      );

      return (
        <p
          key={`${idRunnerInputElement}-${uniqueKeyCounter++}`}
          style={getTextStyle(
            props.theme,
            !props.debugging ? props.playerStorySettings.playerStoryInputStyles : {},
            {}, // can't pass styles
            props.authorStorySettings.authorStoryInputStyles,
            fallbackElementType.input
          )}
        >
          {prefix + text}
        </p>
      );
    };
  }

  /**
   * Creates and returns a hyperlink styled as an option. For forkNameOrAction, if a string is provided, it indicates
   * the fork to go to. Passing a function can execute custom code instead.
   */
  public addOption(text: string, forkNameOrAction: string | (() => void), key?: string, inline?: true) {
    const style = Object.assign({}, this.currentOptionStyles);

    const combinedProps = this.props as CombinedProps;
    const linkAction =
      typeof forkNameOrAction === "function"
        ? forkNameOrAction
        : () => {
            // When clicking the option, push player input to content if at least one item is logged.
            if (
              !combinedProps.authorStorySettings.authorStoryRunnerOptions.hideLog &&
              (!combinedProps.authorStorySettings.authorStoryRunnerOptions.logLimit ||
                combinedProps.authorStorySettings.authorStoryRunnerOptions.logLimit > 0)
            ) {
              this.content.push(this.addInput(text, true));
            }

            // Go to the fork (moves old content to logs as a side effect).
            this.setFork(forkNameOrAction);
          };

    return (props: CombinedProps) => {
      const styleOptions = getTextStyle(
        props.theme,
        !props.debugging ? props.playerStorySettings.playerStoryOptionStyles : {},
        style,
        props.authorStorySettings.authorStoryOptionStyles,
        fallbackElementType.option
      );

      const styleOptionsHighlight = getTextStyle(
        props.theme,
        !props.debugging ? props.playerStorySettings.playerStoryOptionHighlightStyles : {},
        style,
        props.authorStorySettings.authorStoryOptionHighlightStyles,
        fallbackElementType.optionHighlight
      );

      return (
        <ActionButton
          key={key || `${idRunnerOptionElement}-${uniqueKeyCounter++}`}
          onClick={linkAction}
          styles={{
            root: {
              ...(styleOptions as object),
              border: "none",
              display: inline ? "inline" : "block",
              fontSize: "16px",
              height: "unset",
              marginBottom: inline ? "0px" : "4px",
              marginTop: inline ? "0px" : "4px",
              paddingLeft: "0px",
              marginLeft: "0px",
            },
            rootFocused: { ...(styleOptionsHighlight as object) },
            rootHovered: { ...(styleOptionsHighlight as object) },
            label: {
              marginLeft: "0px",
            },
          }}
          text={text}
        />
      );
    };
  }

  /** Creates and returns a text element styled as output text. */
  public addOutput(text: string) {
    const style = Object.assign({}, this.currentOutputStyles);

    return (props: CombinedProps) => {
      const styleOutput = getTextStyle(
        props.theme,
        !props.debugging ? props.playerStorySettings.playerStoryOutputStyles : {},
        style,
        props.authorStorySettings.authorStoryOutputStyles,
        fallbackElementType.output
      );

      return (
        <span key={`${idRunnerOutputElement}-${uniqueKeyCounter++}`} style={styleOutput}>
          {text}
        </span>
      );
    };
  }

  /** Loads the current progress from local storage if possible. */
  public loadFile() {
    // TODO: implement.
  }

  /** Loads an entry and pushes changes to the page, catching and displaying errors on the screen. */
  public loadFork() {
    this.updateLog();
    this.content = [];
    this.options = [];
    this.textboxHidden = true;

    // Clears all timers.
    this.timers.forEach((ref: NodeJS.Timeout) => {
      clearTimeout(ref);
    });

    this.timers = [];
    this.actions = [];

    // Sets up variables.
    let tree: StoryParseNode | undefined;

    // Gets the nodes to process, if possible.
    tree = this.entries[this.fork];
    if (tree === undefined) {
      this.setErrorMessage("Interpreter: fork '" + this.fork + "' not found.");
      return;
    }

    // Records the previous state of all variables.
    this.variablesPrev = {};
    const variablesKeys = Object.keys(this.variables);

    for (let i = 0; i < variablesKeys.length; i++) {
      this.variablesPrev[variablesKeys[i]] = this.variables[variablesKeys[i]];
    }

    // Evaluates every node.
    this.preorderProcess(tree, "");

    // Exits if fork execution stops.
    if (this.stopEvaluation) {
      return;
    }

    // Ensures the fork is considered visited.
    this.visitFork();
    this.refreshInterpreterGui();
  }

  /** Parses a special set of options at the top of the file. */
  public processHeaderOptions(text: string) {
    const combinedProps = this.props as CombinedProps;

    // Clears all old preferences.
    this.refreshInterpreter();

    let lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      // Gets the line and words on that line.
      let line = lines[i];
      let words = line.split(" ");

      // Gets all text after the option has been named.
      let input = "";

      for (let j = 1; j < words.length; j++) {
        input += words[j] + " ";
      }

      input = input.trim();

      if (line.startsWith("link-style-text")) {
        combinedProps.dispatchSetTempStoryRunnerOptions({
          ...combinedProps.currentStorySettings.currentRunnerOptions,
          discreteInlineLinks: true,
        });
      } else if (line.startsWith("option-default-disable")) {
        combinedProps.dispatchSetTempStoryRunnerOptions({
          ...combinedProps.currentStorySettings.currentRunnerOptions,
          hideRestartLink: true,
        });
      } else if (
        line.startsWith("option-color") ||
        line.startsWith("option-hover-color") ||
        line.startsWith("background-color")
      ) {
        // Stores the color to be created.
        let color = "";
        if (!colorRegex.test(input)) {
          this.setErrorMessage(
            "Interpreter: In the line '" +
              line +
              "', color must be given in hex format. It can only include numbers 1-9 and upper or lowercase a-f."
          );
        } else if (input.length !== 6 && input.length !== 3) {
          this.setErrorMessage(
            "Interpreter: In the line '" +
              line +
              "', color must be given in hex format using 3 or 6 digits. For example, f00 or 8800f0."
          );
        } else if (input.length === 3 || input.length === 6) {
          color = input.substring(0, input.length);
        }

        if (line.startsWith("option-color")) {
          this.currentOptionStyles.colorDark = color;
          this.currentOptionStyles.colorLight = color;
        } else if (line.startsWith("option-color-light")) {
          this.currentOptionStyles.colorLight = color;
        } else if (line.startsWith("option-color-dark")) {
          this.currentOptionStyles.colorDark = color;
        } else if (line.startsWith("option-hover-color")) {
          this.currentOptionHighlightStyles.colorDark = color;
          this.currentOptionHighlightStyles.colorLight = color;
        } else if (line.startsWith("option-hover-color-light")) {
          this.currentOptionHighlightStyles.colorLight = color;
        } else if (line.startsWith("option-hover-color-dark")) {
          this.currentOptionHighlightStyles.colorDark = color;
        } else if (line.startsWith("background-color")) {
          combinedProps.dispatchSetAuthorStoryRunnerStyles({
            background: {
              ...combinedProps.authorStorySettings.authorStoryRunnerStyles,
              colorDark: color,
              colorLight: color,
              type: "plain",
            },
          });
        } else if (line.startsWith("background-color-light")) {
          combinedProps.dispatchSetAuthorStoryRunnerStyles({
            background: {
              ...combinedProps.authorStorySettings.authorStoryRunnerStyles,
              colorLight: color,
              type: "plain",
            },
          });
        } else if (line.startsWith("background-color-dark")) {
          combinedProps.dispatchSetAuthorStoryRunnerStyles({
            background: {
              ...combinedProps.authorStorySettings.authorStoryRunnerStyles,
              colorDark: color,
              type: "plain",
            },
          });
        }
      } else if (line.startsWith("output-font-size") || line.startsWith("option-font-size")) {
        if (!numberRegex.test(input)) {
          this.setErrorMessage("Interpreter: In line '" + line + "', a number must be specified after the option.");
          continue;
        }

        let number = parseFloat(input);

        if (number <= 0) {
          this.setErrorMessage("Interpreter: In line '" + line + "', numbers must be greater than zero.");
          continue;
        }

        if (line.startsWith("output-font-size")) {
          this.currentOutputStyles.fontSize = number.toString();
        } else if (line.startsWith("option-font-size")) {
          this.currentOptionStyles.fontSize = number.toString();
        }
      } else if (line.startsWith("option-font")) {
        this.currentOptionStyles.font = `${input}; ${fallbackFontStack}`;
      } else if (line.startsWith("output-font")) {
        this.currentOutputStyles.font = `${input}; ${fallbackFontStack}`;
      }
    }
  }

  /** Re-renders the interpreter and applies the chosen background color. */
  public refreshInterpreterGui() {
    this.refreshInterpreterGuiStyles();
    (this.props as CombinedProps).dispatchRerenderStory();
  }

  /** Renders output. Conditionally renders logs, error message, and textbox. */
  public render(): React.ReactNode {
    this.refreshInterpreterGuiStyles();

    const combinedProps = this.props as CombinedProps;

    const restartOption =
      this.options.length === 0 && !combinedProps.authorStorySettings.authorStoryRunnerOptions.hideRestartLink
        ? [this.getRestartLink() as InterpreterNode]
        : [];

    const allOutput = [
      <div key={idRunnerLog} id={idRunnerLog}>
        {this.logCached}
      </div>,
      <div key={idRunnerContent} id={idRunnerContent}>
        {this.contentCached}
      </div>,
      <div key={idRunnerOptions} id={idRunnerOptions} style={{ marginTop: "24px" }}>
        {this.optionsCached}
        {restartOption}
      </div>,
    ];

    const errorMessage =
      this.props.debugging && this.errorMessage !== "" ? (
        <MessageBar messageBarType={MessageBarType.error}>{this.errorMessage}</MessageBar>
      ) : undefined;

    const textbox = !this.textboxHidden ? (
      <TextField
        autoComplete="nah" // Required for browsers to not autocomplete with address.
        name="textfield" // Required for browsers to not autocomplete with prior entries.
        id={idRunnerInputfield}
        key={idRunnerInputfield}
        onKeyPress={this.onTextboxKeyPress}
        type="text"
      />
    ) : undefined;

    return (
      <div className={runnerWrapperStyle}>
        <div className={runnerOutputWrapperStyle}>{allOutput}</div>
        {errorMessage}
        {textbox}
      </div>
    );
  }

  /** Saves the current progress to local storage if possible. */
  public saveFile() {
    // TODO: implement.
  }

  /** For internal use. Sets the entries usually given by the parser. */
  public setEntries(entries: IPageDictionary) {
    this.entries = entries;
  }

  /** For internal use. Sets the entries usually given by the parser. If forkToLoad is an empty string, loads the first fork. */
  public setEntriesWithFork(entries: IPageDictionary, forkToLoad: string) {
    this.content = [];
    this.log = [];
    this.options = [];
    this.entries = entries;
    this.errorMessage = "";

    const entriesKeys = Object.keys(this.entries);

    if (entriesKeys.length === 0) {
      this.setErrorMessage(
        "Interpreter: cannot play story. It contains no forks. Use @ at the beginning of a line to denote an fork."
      );
    } else {
      if (forkToLoad !== "" && entriesKeys.includes(forkToLoad)) {
        this.setFork(forkToLoad);
      } else {
        this.setFork(entriesKeys[0]);
      }
    }
  }

  /** Sets or clears an error message. */
  public setErrorMessage(error: string | undefined) {
    this.errorMessage = error ?? "";
    this.refreshInterpreterGui();
  }

  /** For internal use. Sets the fork usually given by parsed entries. */
  public setFork(forkName: string) {
    this.fork = forkName;
    this.stopEvaluation = false;

    this.loadFork();
  }

  /** Escapes the given text for all supported escape sequences. */
  private escapeText(text: string, matchBraces: boolean) {
    if (matchBraces) {
      return text.replace(escapeBraceRegex, (str: string) => {
        switch (str) {
          case "\\at":
            return "@";
          case "\\n":
            return "\n";
          case "\\s":
            return "\\";
          case "\\lb":
            return "{";
          case "\\rb":
            return "}";
        }

        return str;
      });
    }

    return text.replace(escapeNoBraceRegex, (str: string) => {
      switch (str) {
        case "\\at":
          return "@";
        case "\\n":
          return "\n";
        case "\\s":
          return "\\";
      }

      return str;
    });
  }

  /** Handles submission of text in the textbox. */
  private onTextboxKeyPress = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.charCode === 13) {
      this.actions.forEach((action) => {
        action(ev.currentTarget.value);
      });

      ev.currentTarget.value = "";
    }
  };

  /**
   * Crawls the given node structure in a depth-first search. If text is provided, it's used
   * solely to evaluate 'if text is' and 'if text has' syntax. Otherwise, those nodes are set to be
   * parsed the next time input is submitted through the textbox.
   */
  private preorderProcess(node: StoryParseNode, textboxText: string) {
    // If the node's conditions are met, processes it and children.
    if (this.processIf(node, textboxText)) {
      this.processText(node);

      for (let i = 0; i < node.children.length; i++) {
        if (this.stopEvaluation) {
          return;
        }

        this.preorderProcess(node.children[i], textboxText);
      }
    }
  }

  /**
   * Interprets the contents of a node is its condition is met. If text is provided, it's used
   * solely to evaluate 'if text is' and 'if text has' syntax. Otherwise, those nodes are set to be
   * parsed the next time input is submitted through the textbox.
   */
  private processIf(node: StoryParseNode, textboxText: string): boolean {
    const combinedProps = this.props as CombinedProps;

    // If there are no conditions, consider it met.
    if (node.condition.trim() === "") {
      return true;
    }

    // Gets the condition without the word 'if'.
    const condition = node.condition.substring(2).trim();
    const words = condition.split(" ");

    // There should be at least one word after 'if'.
    if (words.length === 0) {
      this.setErrorMessage("The line if '" + condition + "' is incorrectly formatted.");
      return false; // Skips ifs with invalid syntax.
    }

    //#region Timers. Syntax: if timer is num
    if (words.length > 1 && words[0] === "timer" && words[1] === "is") {
      if (words.length < 2) {
        this.setErrorMessage("The timer must be set with a time specified in seconds.");
        return false;
      }

      // The third word must be a number.
      if (!numberRegex.test(words[2])) {
        this.setErrorMessage("Interpreter: In line '" + condition + "', the third word must be numeric.");
        return false;
      }

      const number = parseFloat(words[2]);

      if (isNaN(number) || !isFinite(number)) {
        this.setErrorMessage("Interpreter: In line '" + condition + "', the time must be numeric and not too large.");
        return false;
      }

      // The number must be positive.
      if (number <= 0) {
        this.setErrorMessage("Interpreter: In line '" + condition + "', the time must be positive and non-zero.");
        return false;
      }

      // Creates a timer to delay the evaluation of everything in the current if-statement.
      const ref = global.setTimeout(() => {
        this.processText(node);

        for (let i = 0; i < node.children.length; i++) {
          this.preorderProcess(node.children[i], textboxText);
        }
      }, number * 1000);

      this.timers.push(ref);

      return false; // Delays execution of child nodes.
    }
    //#endregion

    //#region Textbox. Syntax: if text (!)is/has/pick query
    // Handles syntax: if text is query, if text has query, if text !is query, if text !has query, if text pick query
    else if (
      words.length > 1 &&
      words[0] === "text" &&
      (words[1] === "is" || words[1] === "!is" || words[1] === "has" || words[1] === "!has" || words[1] === "pick")
    ) {
      // Automatically shows the textbox.
      this.textboxHidden = false;

      let query = ""; // Contains all additional words.

      // Concatenates all words after the command syntax.
      for (let i = 2; i < words.length; i++) {
        query += words[i] + " ";
      }

      query = this.escapeText(query.toLowerCase().trim(), true);

      if (query === "") {
        this.setErrorMessage(
          "Interpreter: In the line 'if " +
            condition +
            "', at least one word to look for must be specified after 'pick'."
        );
      }

      // The generated option adds to the submission event based on whether it's checking if the
      // textbox input is/has the query.
      if (words[1] === "pick") {
        // Splits the query on commas if checking for containing.
        const queryWords = query.split(",");

        // Escapes commas as \c
        for (let i = 0; i < queryWords.length; i++) {
          queryWords[i] = queryWords[i].replace("\\c", ",").trim();
        }

        if (textboxText === "") {
          this.actions.push((text: string) => {
            let containsWord = false;

            // Ensures the text contains at least one word.
            for (let i = 0; i < queryWords.length; i++) {
              const matchWordRegex = new RegExp("\\b" + queryWords[i] + "\\b");
              if (matchWordRegex.test(text.toLowerCase().trim())) {
                containsWord = true;
              }
            }

            if (!containsWord) {
              return;
            }

            // If still executing, conditions are met.
            if (
              !combinedProps.authorStorySettings.authorStoryRunnerOptions.hideLog &&
              (!combinedProps.authorStorySettings.authorStoryRunnerOptions.logLimit ||
                combinedProps.authorStorySettings.authorStoryRunnerOptions.logLimit > 0)
            ) {
              this.content.push(this.addInput(text));
            }

            this.processText(node);

            for (let i = 0; i < node.children.length; i++) {
              this.preorderProcess(node.children[i], text);
            }

            this.refreshInterpreterGui();
          });
        } else {
          let containsWord = false;

          // Ensures the text contains at least one word.
          for (let i = 0; i < queryWords.length; i++) {
            const matchWordRegex = new RegExp("\\b" + queryWords[i] + "\\b");

            if (matchWordRegex.test(textboxText.toLowerCase().trim())) {
              containsWord = true;
            }
          }

          if (!containsWord) {
            return false;
          }

          // If still executing, conditions are met.
          this.processText(node);

          for (let i = 0; i < node.children.length; i++) {
            this.preorderProcess(node.children[i], textboxText);
          }
        }
      } else if (words[1].endsWith("is")) {
        if (textboxText === "") {
          this.actions.push((text: string) => {
            const cleanedText = text.toLowerCase().trim();

            if ((words[1] === "is" && cleanedText === query) || (words[1] === "!is" && cleanedText !== query)) {
              if (
                !combinedProps.authorStorySettings.authorStoryRunnerOptions.hideLog &&
                (!combinedProps.authorStorySettings.authorStoryRunnerOptions.logLimit ||
                  combinedProps.authorStorySettings.authorStoryRunnerOptions.logLimit > 0)
              ) {
                this.content.push(this.addInput(text));
              }

              this.processText(node);

              for (let i = 0; i < node.children.length; i++) {
                this.preorderProcess(node.children[i], text);
              }
            }

            this.refreshInterpreterGui();
          });
        } else {
          if ((words[1] === "is" && textboxText === query) || (words[1] === "!is" && textboxText !== query)) {
            this.processText(node);

            for (let i = 0; i < node.children.length; i++) {
              this.preorderProcess(node.children[i], textboxText);
            }
          }
        }
      } else if (words[1].endsWith("has")) {
        // Splits the query on commas if checking for containing.
        const queryWords = query.split(",");

        // Escapes commas as \c.
        for (let i = 0; i < queryWords.length; i++) {
          queryWords[i] = queryWords[i].replace("\\c", ",").trim();
        }

        if (textboxText === "") {
          this.actions.push((text: string) => {
            // Ensures the text contains each word.
            for (let i = 0; i < queryWords.length; i++) {
              const matchWordRegex = new RegExp("\\b" + queryWords[i] + "\\b");
              const matches = matchWordRegex.test(text.toLowerCase().trim());

              if ((words[1] === "has" && !matches) || (words[1] === "!has" && matches)) {
                return;
              }
            }

            // If still executing, conditions are met.
            if (
              !combinedProps.authorStorySettings.authorStoryRunnerOptions.hideLog &&
              (!combinedProps.authorStorySettings.authorStoryRunnerOptions.logLimit ||
                combinedProps.authorStorySettings.authorStoryRunnerOptions.logLimit > 0)
            ) {
              this.content.push(this.addInput(text));
            }

            this.processText(node);

            for (let i = 0; i < node.children.length; i++) {
              this.preorderProcess(node.children[i], text);
            }

            this.refreshInterpreterGui();
          });
        } else {
          // Ensures the text contains each word.
          for (let i = 0; i < queryWords.length; i++) {
            const matchWordRegex = new RegExp("\\b" + queryWords[i] + "\\b");
            const matches = matchWordRegex.test(textboxText);

            if ((words[1] === "has" && !matches) || (words[1] === "!has" && matches)) {
              return false;
            }
          }

          // If still executing, conditions are met.
          this.processText(node);

          for (let i = 0; i < node.children.length; i++) {
            this.preorderProcess(node.children[i], textboxText);
          }
        }
      }

      return false; // Execution of child nodes is conditional.
    }
    //#endregion

    //#region Truth tests. Syntax: if expr; expr must be true or false.
    else {
      // Unregisters previously-set variables and confirms options.
      exprParser.optIncludeUnknowns = true;
      exprParser.resetTokens();

      const variablesKeys = Object.keys(this.variables);

      // Supports syntax: if visited, if !visited
      const varValue = this.variables["visited" + this.fork] as number;
      exprParser.addIdentifier(new TokenId("visited", varValue));

      // Registers all valid variables with the math parser.
      for (let i = 0; i < variablesKeys.length; i++) {
        const varName = variablesKeys[i];
        const varVal = this.variables[variablesKeys[i]];

        exprParser.addIdentifier(new TokenId(varName, varVal));
      }

      // Registers a function to check if a variable exists.
      exprParser.addFunction(
        new TokenFunc("exists", 1, (tokens) => {
          if (tokens[0] instanceof TokenBool) {
            return tokens[0];
          }

          return new TokenBool(!(tokens[0] instanceof TokenId));
        })
      );

      let result = "";
      let resultVal = null;

      // Attempts to compute the expression.
      try {
        result = exprParser.eval(words.join(" "));
      } catch (e) {
        if (e instanceof Error) {
          this.setErrorMessage(e.message);
        } else {
          this.setErrorMessage(e);
        }

        return false;
      }

      // Parses the computed result as a bool.
      if (result === "true" || result === "false") {
        return result === "true";
      } else {
        this.setErrorMessage(
          "Interpreter: In the line 'if " +
            words.join(" ") +
            "', the expression must be boolean (true or false), but was " +
            resultVal +
            " instead."
        );

        return false;
      }
    }
  }

  /** Interprets the node text to display output and evaluate commands. */
  private processText(node: StoryParseNode) {
    let textLeft = node.text;

    // Processes all text until none is left.
    while (textLeft.length > 0) {
      // Gets the current line and its words.
      let endOfLine = textLeft.indexOf("\n");
      let line: string;

      if (endOfLine >= 0) {
        line = textLeft.substring(0, endOfLine);
      } else {
        line = textLeft;
      }

      let words = line.split(" ");

      //#region Handles empty lines if they appear.
      // Removes excess lines.
      if (line.trim() === "") {
        // Deletes pointless whitespace.
        textLeft = textLeft.substring(endOfLine + 1);
      }
      //#endregion

      //#region Parse in-line options. Syntax: output@@forkname.
      else if (line.includes("@@")) {
        let forkName = line
          .substring(line.indexOf("@") + 2)
          .replace(whitespaceRegex, "")
          .toLowerCase();

        let displayName = this.escapeText(line.substring(0, line.indexOf("@")).trim(), false);

        // Handles having no hyperlink or display name.
        if (forkName === "") {
          this.setErrorMessage("Interpreter: there was no fork name given to option '" + displayName + "'.");
        } else if (displayName.trim() === "") {
          this.setErrorMessage(
            "Interpreter: the option linking to '" + forkName + "' has no displayable text specified."
          );
        } else if (this.entries[forkName] === undefined) {
          this.setErrorMessage(
            "Interpreter: the fork in the option '" + displayName + "@" + forkName + "' doesn't exist."
          );
        } else {
          this.content.push(this.addOption(displayName, forkName, undefined, true));
        }

        // Deletes the line just processed.
        textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);
      }
      //#endregion

      //#region Parse options. Syntax: output@forkname.
      else if (line.includes("@")) {
        // Gets the fork name. Case and space insensitive.
        const indexOfAt = line.indexOf("@");
        const forkName = line
          .substring(indexOfAt + 1)
          .replace(whitespaceRegex, "")
          .toLowerCase();
        const displayName = this.escapeText(line.substring(0, indexOfAt).trim(), false);

        // Handles having no hyperlink or display name.
        if (forkName === "") {
          this.setErrorMessage("Interpreter: there was no fork name given to option '" + displayName + "'.");
        } else if (displayName.trim() === "") {
          this.setErrorMessage(
            "Interpreter: the option linking to '" + forkName + "' has no displayable text specified."
          );
        } else {
          this.options.push(this.addOption(displayName, forkName));
        }

        // Deletes the line just processed.
        textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);
      }
      //#endregion

      //#region Print text. Syntax: {output text}.
      // Parses output text and escape characters.
      else if (line.includes("{")) {
        let lbPos = textLeft.indexOf("{");
        let rbPos = textLeft.indexOf("}");
        let output = textLeft.substring(lbPos, rbPos + 1);

        if (rbPos < lbPos) {
          this.setErrorMessage("Interpreter: In the line '" + line + "', right braces should follow left braces. ");

          // Skips the unprocessable line.
          textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);

          continue;
        }

        if (output.includes("***}")) {
          this.currentOutputStyles.styleItalic = true;
          this.currentOutputStyles.styleBold = true;
        } else if (output.includes("**}")) {
          this.currentOutputStyles.styleBold = true;
          this.currentOutputStyles.styleItalic = undefined;
        } else if (output.includes("*}")) {
          this.currentOutputStyles.styleBold = undefined;
          this.currentOutputStyles.styleItalic = true;
        } else {
          this.currentOutputStyles.styleBold = undefined;
          this.currentOutputStyles.styleItalic = undefined;
        }

        // create output
        output = this.escapeText(
          output.replace("{", "").replace("***}", "").replace("**}", "").replace("*}", "").replace("}", ""),
          true
        );

        // Generates the text
        this.content.push(this.addOutput(output));

        // Removes the processed text.
        textLeft = textLeft.substring(0, lbPos) + textLeft.substring(rbPos + 1, textLeft.length);
      }
      //#endregion

      //#region Set variables.
      else if (textLeft.startsWith("set")) {
        // Unregisters previously-set variables.
        exprParser.optIncludeUnknowns = false;
        exprParser.resetTokens();

        // Registers all valid variables with the math parser.
        const variablesKeys = Object.keys(this.variables);
        for (let i = 0; i < variablesKeys.length; i++) {
          const varName = variablesKeys[i];
          const varVal = this.variables[variablesKeys[i]];

          if (typeof varVal === "number") {
            exprParser.addIdentifier(new TokenId(varName, varVal));
          } else if (typeof varVal === "boolean") {
            exprParser.addIdentifier(new TokenId(varName, varVal));
          }
        }

        // Registers a function to set a random number.
        exprParser.addFunction(
          new TokenFunc("random", 1, (tokens) => {
            if (tokens[0] instanceof TokenNum) {
              const n0 = tokens[0] as TokenNum;

              return new TokenNum(random!.nextNumber() * n0.value + 1);
            }

            return null;
          })
        );

        // Gets the index to separate left and right-hand sides.
        let exprTwoSidedIndex = words.indexOf("=");

        // Handles expressions with both LHS and RHS.
        if (exprTwoSidedIndex !== -1) {
          let lhs = words.slice(1, exprTwoSidedIndex);
          let rhs = words.slice(exprTwoSidedIndex + 1);
          let result = "";
          let resultVal = null;

          // If the left-hand side is a single word.
          if (lhs.length === 1) {
            // Attempts to compute the RHS expression.
            try {
              result = exprParser.eval(rhs.join(" "));
            } catch (e) {
              if (e instanceof Error) {
                this.setErrorMessage("Interpreter: In the line '" + line + "', " + e.message);
              } else {
                this.setErrorMessage("Interpreter: In the line '" + line + ", " + e);
              }
            }

            // Parses the computed result as a bool.
            if (result === "true" || result === "false") {
              resultVal = result === "true";
            }

            // Parses the computed result as a number.
            else {
              if (numberRegex.test(result)) {
                resultVal = parseFloat(result);
              } else {
                this.setErrorMessage(
                  "Interpreter: In the line '" +
                    line +
                    "', the expression " +
                    rhs.join(" ") +
                    " should be a number, but " +
                    result +
                    " was computed instead."
                );
              }
            }

            // Sets or adds the new value as appropriate.
            if (variablesKeys.includes(lhs[0])) {
              this.variables[lhs[0]] = resultVal as number | boolean;
            } else {
              if (singleDigitRegex.test(lhs[0][0]) || exprParser.getTokens().some((o) => o.strForm === lhs[0])) {
                this.setErrorMessage(
                  "Interpreter: In the line '" +
                    line +
                    "', the variable '" +
                    lhs[0] +
                    "' is a name used for math or is a number."
                );
              } else {
                this.variables[lhs[0]] = resultVal as number | boolean;
              }
            }
          } else {
            this.setErrorMessage(
              "Interpreter: In the line '" +
                line +
                ", the phrase " +
                lhs.join(" ") +
                " must be a variable name without spaces."
            );
          }
        }

        // Handles shorthand expressions with only the LHS.
        else {
          let lhs = words.slice(1);
          let result = "";
          let resultVal = null;

          if (lhs.length > 0) {
            // Syntax: set name, set !name
            if (lhs.length === 1) {
              // Sets false boolean values.
              if (lhs[0].startsWith("!")) {
                let lhsBool = lhs[0].substring(1);

                if (variablesKeys.includes(lhsBool)) {
                  this.variables[lhsBool] = false;
                } else if (
                  (lhs.length > 0 && singleDigitRegex.test(lhs[0][0])) ||
                  exprParser.getTokens().some((tok) => tok.strForm === lhsBool)
                ) {
                  this.setErrorMessage(
                    "Interpreter: In the line '" +
                      line +
                      "', the variable '" +
                      lhsBool +
                      "' is a number or is used for math."
                  );
                } else {
                  this.variables[lhsBool] = false;
                }
              }

              // Sets true boolean values.
              else {
                if (variablesKeys.includes(lhs[0])) {
                  this.variables[lhs[0]] = true;
                } else if (
                  (lhs.length > 0 && singleDigitRegex.test(lhs[0][0])) ||
                  exprParser.getTokens().some((tok) => tok.strForm === lhs[0])
                ) {
                  this.setErrorMessage(
                    "Interpreter: In the line '" +
                      line +
                      "', the variable '" +
                      lhs[0] +
                      "' is a number or is used for math."
                  );
                } else {
                  this.variables[lhs[0]] = true;
                }
              }
            }

            // Syntax: set EXPR, where EXPR is a math expression and not equation.
            // This is computed as set name = EXPR.
            else if (variablesKeys.includes(lhs[0])) {
              // Attempts to compute the LHS expression.
              try {
                result = exprParser.eval(lhs.join(" "));
              } catch (e) {
                if (e instanceof Error) {
                  this.setErrorMessage("Interpreter: In the line '" + line + "', " + e.message);
                } else {
                  this.setErrorMessage("Interpreter: In the line '" + line + "', " + e);
                }
              }

              // Parses the computed result as a bool.
              if (result === "true" || result === "false") {
                resultVal = result === "true";
              }

              // Parses the computed result as a number.
              else {
                if (numberRegex.test(result)) {
                  resultVal = parseFloat(result);
                } else {
                  this.setErrorMessage(
                    "Interpreter: In the line '" +
                      line +
                      "', the expression " +
                      lhs.join(" ") +
                      " should be a number, but " +
                      result +
                      " was computed instead."
                  );
                }
              }

              this.variables[lhs[0]] = resultVal as number | boolean;
            } else {
              this.setErrorMessage(
                "Interpreter: In the line '" + line + "', the variable " + lhs[0] + " doesn't exist yet."
              );
            }
          } else {
            this.setErrorMessage(
              "Interpreter: In the line '" +
                line +
                "', you need to provide a variable name to set, using syntax like set a, set !a, or a mathematical expression."
            );
          }
        }

        // Deletes the line just processed.
        if (endOfLine >= 0) {
          textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);
        } else {
          textLeft = "";
        }
      }
      //#endregion

      //#region Print variables. Syntax: get name.
      // Syntax: get name.
      else if (textLeft.startsWith("get")) {
        if (words.length === 2) {
          if (this.variables[words[1]] !== undefined) {
            this.content.push(this.addOutput(this.variables[words[1]].toString()));
          } else {
            this.setErrorMessage("Interpreter: In the line '" + line + "', variable " + words[1] + " does not exist.");
          }
        } else {
          this.setErrorMessage("Interpreter: In the line '" + line + "', only one word can follow 'get'.");
        }

        // Deletes the line just processed.
        if (endOfLine >= 0) {
          textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);
        } else {
          textLeft = "";
        }
      }
      //#endregion

      //#region Immediately jumps to another forks. Syntax: goto forkname.
      // Handles syntax: goto forkname.
      else if (textLeft.startsWith("goto")) {
        let forkName = line.substring(4).replace(whitespaceRegex, "").toLowerCase();

        if (this.entries[forkName] !== undefined) {
          // Ensures this page is considered visited, then executes the page being jumped to. When
          // execution flow returns, this exits out of everything.
          this.visitFork();
          this.setFork(forkName);
          this.stopEvaluation = true;
          return;
        } else {
          this.setErrorMessage(
            "Interpreter: In the line '" +
              textLeft +
              "', cannot navigate to fork '" +
              forkName +
              "' because it does not exist."
          );
        }

        // Deletes the line just processed.
        if (endOfLine >= 0) {
          textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);
        } else {
          textLeft = "";
        }
      }
      //#endregion

      //#region Set text color. Syntax: color ffffff, color fff.
      // Handles syntax: color ffffff (and other hex codes).
      else if (textLeft.startsWith("color")) {
        let color = line.substring(5).trim().toLowerCase();
        if (!colorRegex.test(color)) {
          this.setErrorMessage(
            "Interpreter: In the line '" +
              line +
              "', color must be given in hex format. It can only include numbers 1-9 and upper or lowercase a-f."
          );
        } else if (color.length !== 6 && color.length !== 3) {
          this.setErrorMessage(
            "Interpreter: In the line '" +
              line +
              "', color must be given in hex format using 3 or 6 digits. For example, f00 or 8800f0."
          );
        } else {
          this.currentOutputStyles.colorDark = color;
          this.currentOutputStyles.colorLight = color;
        }

        // Deletes the line just processed.
        if (endOfLine >= 0) {
          textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);
        } else {
          textLeft = "";
        }
      }
      //#endregion

      // Anything left is an error.
      else {
        this.setErrorMessage(
          "Interpreter: In the line '" +
            line +
            "', unexpected symbols encountered. Ensure all output text is wrapped in single braces and there are no extra braces inside."
        );

        // Skips the unprocessable line.
        textLeft = textLeft.substring(textLeft.indexOf("\n") + 1);
      }
    }
  }

  /** Initializes or resets the interpreter states. */
  private refreshInterpreter() {
    this.actions = [];
    this.content = [];
    this.currentOptionStyles = {};
    this.currentOptionHighlightStyles = {};
    this.currentOutputStyles = {};
    this.errorMessage = "";
    this.fork = "";
    this.log = [];
    this.options = [];
    this.timers = [];
    this.variables = {};
    this.variablesPrev = {};

    this.refreshInterpreterGuiStyles();
  }

  /** Initializes or resets the gui styles. */
  private refreshInterpreterGuiStyles() {
    const combinedProps = this.props as CombinedProps;

    // Updates the background color of the runner.
    const runner = document.getElementById(idRunnerWrapper);

    if (runner) {
      if (combinedProps.playerStorySettings.playerStoryRunnerStyles.background.type === "plain") {
        runner.style["backgroundColor"] =
          combinedProps.theme.themeType === ThemeTypes.Light
            ? combinedProps.playerStorySettings.playerStoryRunnerStyles.background.colorLight ||
              combinedProps.theme.theme.semanticColors.bodyBackground
            : combinedProps.playerStorySettings.playerStoryRunnerStyles.background.colorDark ||
              combinedProps.theme.theme.semanticColors.bodyBackground;
      } else if (combinedProps.authorStorySettings.authorStoryRunnerStyles.background.type === "plain") {
        runner.style["backgroundColor"] =
          combinedProps.theme.themeType === ThemeTypes.Light
            ? combinedProps.authorStorySettings.authorStoryRunnerStyles.background.colorLight ||
              combinedProps.theme.theme.semanticColors.bodyBackground
            : combinedProps.authorStorySettings.authorStoryRunnerStyles.background.colorDark ||
              combinedProps.theme.theme.semanticColors.bodyBackground;
      }
    }
  }

  /** Called when a restart link is pressed or restart is invoked. */
  private restartGame = () => {
    this.refreshInterpreter();

    const entriesKeys = Object.keys(this.entries);
    this.setFork(entriesKeys[0]);
  };

  /** Empties the log or updates it, depending on interpreter options. */
  private updateLog() {
    const combinedProps = this.props as CombinedProps;

    if (
      combinedProps.authorStorySettings.authorStoryRunnerOptions.hideLog ||
      combinedProps.authorStorySettings.authorStoryRunnerOptions.logLimit === 0
    ) {
      this.log = [];
    } else {
      this.log.push(...this.content);
    }
  }

  /**
   * Called when a fork is finished executing or is stopped so another fork can run, in which this
   * should execute immediately.
   */
  private visitFork() {
    // Automatically sets variables to indicate pages were visited.
    if (this.variables["visited" + this.fork] === undefined) {
      this.variables["visited" + this.fork] = true;
    }
  }
}

export const StoryInterpreter = connect(mapStateToProps, mapDispatchToProps, undefined, {
  forwardRef: true,
})(StoryInterpreterC);
