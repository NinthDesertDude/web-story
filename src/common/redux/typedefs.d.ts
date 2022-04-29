/** Determines the colors available in a text style. */
export interface ITextStyleColors {
  /** Text color as seen in dark theme. Defaults to dark theme text color. */
  colorDark?: string;

  /** Text color of highlighted text as seen in dark theme. Defaults to light theme highlight color. */
  colorHighlightDark?: string;

  /** Text color of highlighted text as seen in light theme. Defaults to light theme highlight color. */
  colorHighlightLight?: string;

  /** Text color as seen in light theme. Defaults to light theme text color. */
  colorLight?: string;
}

/** Determines the appearance of text. */
export interface ITextStyle extends ITextStyleColors {
  /** Text size. Defaults to 1 rem. Only px and rem should be used. */
  fontSize?: string;

  /** Font family. Defaults to the app font fallback list. */
  font?: string;

  /** Controls the override for text bolding. Defaults to inheriting the style. */
  styleBold?: boolean;

  /** Controls the override for text italicizing. Defaults to inheriting the style. */
  styleItalic?: boolean;

  /** Controls the override for text strikethrough. Defaults to inheriting the style. */
  styleStrikethrough?: boolean;

  /** Controls the override for text underline. Defaults to inheriting the style. */
  styleUnderline?: boolean;
}

/** Determines the appearance of a border. */
export interface IBorderStyle {
  /** Defaults to dark theme text color. */
  colorDark?: string;

  /** Defaults to light theme text color. */
  colorLight?: string;

  /** Defaults to solid. */
  style?: "dotted" | "dashed" | "double";

  /** Defaults to 0.07 rem. */
  thickness?: number;

  /** Defaults to being sharp (no border radius). */
  cornerRounding?: "semiround" | "round";
}

/** Determines the appearance of the log separator. */
export interface IRunnerLogSeparatorStyle {
  style: (IRunnerLogSeparatorBarStyle & { type: "bar" }) | (IRunnerLogSeparatorImageStyle & { type: "image" });
}

/** Determines the appearance of a line separating old and current page contents. */
export interface IRunnerLogSeparatorBarStyle extends IBorderStyle {}

/** Determines the appearance of an image separating old and current page elements. */
export interface IRunnerLogSeparatorImageStyle {
  /**
   * Determines how images respond to story width, scaling only horizontally or both horizontally and vertically until
   * the image touches both sides of the story column width. Defaults to no scaling.
   */
  scaling?: "scaleWide" | "scaleBoth";

  /** Image path. It can be a relative local file url, or an absolute web url without the protocol. */
  imageUrl: string;
}

/** Determines the overall appearance of the player. */
export interface IRunnerStyle {
  /** The background can be plain or an image. */
  background: (IRunnerPlainStyle & { type: "plain" }) | (IRunnerImageStyle & { type: "image" });
}

/** Determines the appearance of a plain background for the player. */
export interface IRunnerPlainStyle {
  /** Background color of the player as seen in dark mode. Defaults to dark theme background color. */
  colorDark?: string;

  /** Background color of the player as seen in light mode. Defaults to light theme background color. */
  colorLight?: string;
}

/** Determines the appearance of an image background for the player. */
export interface IRunnerImageStyle {
  /**
   * Tiling display style. The image can stretch horizontally and tile vertically, or tile in both directions. Defaults
   * to stretching to fill visible space (without moving when the user scrolls).
   */
  tileMode?: "tileVertical" | "tileBoth";

  /** Image path. It can be a relative local file url, or an absolute web url without the protocol. */
  imageUrl: string;

  /** A rectangle below the text and above the background image. By default, no underlay is shown. */
  textUnderlay?: IRunnerTextUnderlayStyle;
}

/** Determines the appearance of a rectangle between the background image and page contents. */
export interface IRunnerTextUnderlayStyle {
  /** Styles the border of a rectangle above the background image and below the text. Defaults to no border. */
  border?: IBorderStyle;

  /** Color of the underlay rectangle as seen in dark theme. Defaults to dark theme text color. */
  colorDark?: string;

  /** Color of the underlay rectangle as seen in light theme. Defaults to light theme text color. */
  colorLight?: string;

  /** Opacity of the underlay rectangle as a value from 0 (translucent) to 1 (opaque). Defaults to 1. */
  opacity?: number;
}

/** Options the author chooses that affect the behavior of the runner. */
export interface IAuthorRunnerOptions {
  /**
   * If true, inline links are styled like regular text. The beam cursor is used. This doesn't prevent screen readers
   * or tabbing from revealing inline links.
   */
  discreteInlineLinks?: true;

  /** Whether to hide old output and input blocks in the runner. Default false. */
  hideLog?: true;

  /** Whether to hide the restart link when there are no hyperlinks out of a page. Default false. */
  hideRestartLink?: true;

  /** Number of output and input blocks to preserve. Default unrestricted. */
  logLimit?: number;

  /** A seed to use for random number generation, if provided. Defaults to a value based on the current millisecond. */
  randomSeed?: number;
}

/** String overrides for built-in strings. */
export interface IAuthorRunnerStrings {
  /** Overrides the text for the default restart link. Defaults to "restart". */
  restartLinkText?: string;

  /** Overrides the text prefixed to logged player input when they click an option. Defaults to •. */
  inputOptionPrefixText?: string;

  /** Overrides the text prefixed to logged player input when they submit text. Defaults to →. */
  inputTextboxPrefixText?: string;
}

/** Options the player chooses that affect the behavior of the runner. */
export interface IPlayerRunnerOptions {
  /**
   * A value from 0 to 1 for the volume of all audio, overriding author settings. Audio doesn't play or load if the
   * value is 0. Defaults to 1.
   */
  audioVolume?: number;

  /** Doesn't show or load graphics when true. Defaults to false. */
  disableGraphics?: true;

  /** If true, does not populate suggestions for commands in the textbox. False by default. */
  disableTextSuggestions?: true;

  /** If true, audio elements only play on touch. False by default. */
  manualAudio?: true;

  /** If true, graphical elements are hidden until revealed by touch. False by default. */
  manualGraphics?: true;
}
