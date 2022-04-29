import { getActionGuid } from "../../common/redux/reduxTools";
import {
  IRunnerLogSeparatorStyle,
  IRunnerStyle,
  IAuthorRunnerOptions,
  ITextStyle,
  IAuthorRunnerStrings,
} from "../../common/redux/typedefs";

export const actions = {
  setAuthorStoryInputStyles: getActionGuid(),
  setAuthorStoryLogSeparatorStyles: getActionGuid(),
  setAuthorStoryOptionStyles: getActionGuid(),
  setAuthorStoryOptionHighlightStyles: getActionGuid(),
  setAuthorStoryOutputStyles: getActionGuid(),
  setAuthorStoryRunnerOptions: getActionGuid(),
  setAuthorStoryRunnerStyles: getActionGuid(),
  setAuthorStoryStrings: getActionGuid(),
};

/**
 * Sets the global story styling for previous textbox input from the player. This isn't necessarily the final styling.
 * The order goes built-in defaults -> global story styling -> story style override -> player style override.
 */
export const setAuthorStoryInputStyles = (style: ITextStyle) => {
  return {
    type: actions.setAuthorStoryInputStyles,
    style,
  };
};

/*
 * Sets the global story styling for the log separator. This isn't necessarily the final styling. The order goes
 * built-in defaults -> global story styling -> player style override.
 */
export const setAuthorStoryLogSeparatorStyles = (style: IRunnerLogSeparatorStyle) => {
  return {
    type: actions.setAuthorStoryLogSeparatorStyles,
    style,
  };
};

/**
 * Sets the global story styling for hyperlinks in the story. This isn't necessarily the final styling. The order goes
 * built-in defaults -> global story styling -> story style override -> player style override.
 */
export const setAuthorStoryOptionStyles = (style: ITextStyle) => {
  return {
    type: actions.setAuthorStoryOptionStyles,
    style,
  };
};

/**
 * Sets the global story styling for hovered hyperlinks in the story. This isn't necessarily the final styling. The
 * order goes built-in defaults -> global story styling -> story style override -> player style override.
 */
export const setAuthorStoryOptionHighlightStyles = (style: ITextStyle) => {
  return {
    type: actions.setAuthorStoryOptionHighlightStyles,
    style,
  };
};

/**
 * Sets the global story styling for all text output from the story. This isn't necessarily the final styling. The
 * order goes built-in defaults -> global story styling -> story style override -> player style override.
 */
export const setAuthorStoryOutputStyles = (style: ITextStyle) => {
  return {
    type: actions.setAuthorStoryOutputStyles,
    style,
  };
};

/**
 * Sets story options such as logging behavior.
 */
export const setAuthorStoryRunnerOptions = (options: IAuthorRunnerOptions) => {
  return {
    type: actions.setAuthorStoryRunnerOptions,
    options,
  };
};

/**
 * Sets the global story styling for the runner itself. This isn't necessarily the final styling. The order goes
 * built-in defaults -> global story styling -> story style override -> player style override.
 */
export const setAuthorStoryRunnerStyles = (style: IRunnerStyle) => {
  return {
    type: actions.setAuthorStoryRunnerStyles,
    style,
  };
};

/**
 * Overrides special built-in strings relevant to the story.
 */
export const setAuthorStoryStrings = (strings: IAuthorRunnerStrings) => {
  return {
    type: actions.setAuthorStoryStrings,
    strings,
  };
};
