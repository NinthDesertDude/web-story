import { getActionGuid } from "../../common/redux/reduxTools";
import { IRunnerLogSeparatorStyle, IRunnerStyle, IPlayerRunnerOptions, ITextStyle } from "../../common/redux/typedefs";

export const actions = {
  setPlayerStoryInputStyles: getActionGuid(),
  setPlayerStoryLogSeparatorStyles: getActionGuid(),
  setPlayerStoryOptionStyles: getActionGuid(),
  setPlayerStoryOptionHighlightStyles: getActionGuid(),
  setPlayerStoryOutputStyles: getActionGuid(),
  setPlayerStoryRunnerOptions: getActionGuid(),
  setPlayerStoryRunnerStyles: getActionGuid(),
};

/**
 * Sets the player preferred styling for previous textbox input from the player. This is the final styling.
 * The order goes built-in defaults -> global story styling -> story style override -> player style override.
 */
export const setPlayerStoryInputStyles = (style: ITextStyle) => {
  return {
    type: actions.setPlayerStoryInputStyles,
    style,
  };
};

/*
 * Sets the player preferred styling for the log separator. This is the final styling. The order goes
 * built-in defaults -> global story styling -> player style override.
 */
export const setPlayerStoryLogSeparatorStyles = (style: IRunnerLogSeparatorStyle) => {
  return {
    type: actions.setPlayerStoryLogSeparatorStyles,
    style,
  };
};

/**
 * Sets the player preferred styling for hyperlinks in the story. This is the final styling. The order goes
 * built-in defaults -> global story styling -> story style override -> player style override.
 */
export const setPlayerStoryOptionStyles = (style: ITextStyle) => {
  return {
    type: actions.setPlayerStoryOptionStyles,
    style,
  };
};

/**
 * Sets the player preferred styling for hovered hyperlinks in the story. This is the final styling. The
 * order goes built-in defaults -> global story styling -> story style override -> player style override.
 */
export const setPlayerStoryOptionHighlightStyles = (style: ITextStyle) => {
  return {
    type: actions.setPlayerStoryOptionHighlightStyles,
    style,
  };
};

/**
 * Sets the player preferred styling for all text output from the story. This is the final styling. The
 * order goes built-in defaults -> global story styling -> story style override -> player style override.
 */
export const setPlayerStoryOutputStyles = (style: ITextStyle) => {
  return {
    type: actions.setPlayerStoryOutputStyles,
    style,
  };
};

/**
 * Sets story options such as logging behavior.
 */
export const setPlayerStoryRunnerOptions = (options: IPlayerRunnerOptions) => {
  return {
    type: actions.setPlayerStoryRunnerOptions,
    options,
  };
};

/**
 * Sets the player preferred styling for the runner itself. This is the final styling. The order goes
 * built-in defaults -> global story styling -> story style override -> player style override.
 */
export const setPlayerStoryRunnerStyles = (style: IRunnerStyle) => {
  return {
    type: actions.setPlayerStoryRunnerStyles,
    style,
  };
};
