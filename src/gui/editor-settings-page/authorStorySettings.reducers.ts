import { combineReducers, Dispatch } from "redux";
import * as actions from "./authorStorySettings.actions";
import { IAction } from "../../common/redux/reduxTools";
import * as types from "../../common/redux/typedefs";
import { newStory } from "../editor/viewedit.actions";

const authorStoryInputStyles = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setAuthorStoryInputStyles) {
    return (action as ReturnType<typeof actions.setAuthorStoryInputStyles>).style;
  }
  if (action.type === newStory.type) {
    return {};
  }

  return state;
};

const authorStoryLogSeparatorStyles = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setAuthorStoryLogSeparatorStyles) {
    return (action as ReturnType<typeof actions.setAuthorStoryLogSeparatorStyles>).style;
  }
  if (action.type === newStory.type) {
    return {};
  }

  return state;
};

const authorStoryOptionStyles = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setAuthorStoryOptionStyles) {
    return (action as ReturnType<typeof actions.setAuthorStoryOptionStyles>).style;
  }
  if (action.type === newStory.type) {
    return {};
  }

  return state;
};

const authorStoryOptionHighlightStyles = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setAuthorStoryOptionHighlightStyles) {
    return (action as ReturnType<typeof actions.setAuthorStoryOptionHighlightStyles>).style;
  }
  if (action.type === newStory.type) {
    return {};
  }

  return state;
};

const authorStoryOutputStyles = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setAuthorStoryOutputStyles) {
    return (action as ReturnType<typeof actions.setAuthorStoryOutputStyles>).style;
  }
  if (action.type === newStory.type) {
    return {};
  }

  return state;
};

const authorStoryRunnerOptions = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setAuthorStoryRunnerOptions) {
    return (action as ReturnType<typeof actions.setAuthorStoryRunnerOptions>).options;
  }
  if (action.type === newStory.type) {
    return {};
  }

  return state;
};

const authorStoryRunnerStyles = (state = { background: { type: "plain" } }, action: IAction) => {
  if (action.type === actions.actions.setAuthorStoryRunnerStyles) {
    return (action as ReturnType<typeof actions.setAuthorStoryRunnerStyles>).style;
  }
  if (action.type === newStory.type) {
    return { background: { type: "plain" } };
  }

  return state;
};

const authorStoryStrings = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setAuthorStoryStrings) {
    return (action as ReturnType<typeof actions.setAuthorStoryStrings>).strings;
  }
  if (action.type === newStory.type) {
    return {};
  }

  return state;
};

export const dispatchSetAuthorStoryInputStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setAuthorStoryInputStyles(style));
};

export const dispatchSetAuthorStoryLogSeparatorStyles =
  (dispatch: Dispatch) => (style: types.IRunnerLogSeparatorStyle) => {
    dispatch(actions.setAuthorStoryLogSeparatorStyles(style));
  };

export const dispatchSetAuthorStoryOptionStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setAuthorStoryOptionStyles(style));
};

export const dispatchSetAuthorStoryOptionHighlightStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setAuthorStoryOptionHighlightStyles(style));
};

export const dispatchSetAuthorStoryOutputStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setAuthorStoryOutputStyles(style));
};

export const dispatchSetAuthorStoryRunnerOptions = (dispatch: Dispatch) => (options: types.IAuthorRunnerOptions) => {
  dispatch(actions.setAuthorStoryRunnerOptions(options));
};

export const dispatchSetAuthorStoryRunnerStyles = (dispatch: Dispatch) => (style: types.IRunnerStyle) => {
  dispatch(actions.setAuthorStoryRunnerStyles(style));
};

export const dispatchSetAuthorStoryStrings = (dispatch: Dispatch) => (strings: types.IAuthorRunnerStrings) => {
  dispatch(actions.setAuthorStoryStrings(strings));
};

// Combine reducers and typescript definition.
export interface IAuthorStorySettingsState {
  authorStoryInputStyles: types.ITextStyle;
  authorStoryLogSeparatorStyles: types.IRunnerLogSeparatorStyle;
  authorStoryOptionStyles: types.ITextStyle;
  authorStoryOptionHighlightStyles: types.ITextStyle;
  authorStoryOutputStyles: types.ITextStyle;
  authorStoryRunnerOptions: types.IAuthorRunnerOptions;
  authorStoryRunnerStyles: types.IRunnerStyle;
  authorStoryStrings: types.IAuthorRunnerStrings;
}

export const authorStorySettings = combineReducers({
  authorStoryInputStyles,
  authorStoryLogSeparatorStyles,
  authorStoryOptionStyles,
  authorStoryOptionHighlightStyles,
  authorStoryOutputStyles,
  authorStoryRunnerOptions,
  authorStoryRunnerStyles,
  authorStoryStrings,
});
