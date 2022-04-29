import { combineReducers, Dispatch } from "redux";
import * as actions from "./playerStorySettings.actions";
import { IAction } from "../../common/redux/reduxTools";
import * as types from "../../common/redux/typedefs";
import { newStory } from "../editor/viewedit.actions";
import * as persistence from "../../common/storage/persistence.actions";
import { cleanLoadedTextStyle } from "../../common/storage/LocalStorageSaveHandler";

const playerStoryInputStyles = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setPlayerStoryInputStyles) {
    return (action as ReturnType<typeof actions.setPlayerStoryInputStyles>).style;
  }
  if (action.type === newStory.type) {
    return {};
  }
  if (action.type === persistence.actions.setFromLocalStorage) {
    const typedAction = action as ReturnType<typeof persistence.setFromLocalStorage>;

    if (typedAction.persistentState.playerStorySettings?.playerStoryInputStyles) {
      return cleanLoadedTextStyle(typedAction.persistentState.playerStorySettings.playerStoryInputStyles);
    }
  }

  return state;
};

const playerStoryLogSeparatorStyles = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setPlayerStoryLogSeparatorStyles) {
    return (action as ReturnType<typeof actions.setPlayerStoryLogSeparatorStyles>).style;
  }
  if (action.type === newStory.type) {
    return {};
  }
  if (action.type === persistence.actions.setFromLocalStorage) {
    const typedAction = action as ReturnType<typeof persistence.setFromLocalStorage>;

    if (typedAction.persistentState.playerStorySettings?.playerStoryLogSeparatorStyles) {
      return typedAction.persistentState.playerStorySettings.playerStoryLogSeparatorStyles;
    }
  }

  return state;
};

const playerStoryOptionStyles = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setPlayerStoryOptionStyles) {
    return (action as ReturnType<typeof actions.setPlayerStoryOptionStyles>).style;
  }
  if (action.type === newStory.type) {
    return {};
  }
  if (action.type === persistence.actions.setFromLocalStorage) {
    const typedAction = action as ReturnType<typeof persistence.setFromLocalStorage>;

    if (typedAction.persistentState.playerStorySettings?.playerStoryOptionStyles) {
      return cleanLoadedTextStyle(typedAction.persistentState.playerStorySettings.playerStoryOptionStyles);
    }
  }

  return state;
};

const playerStoryOptionHighlightStyles = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setPlayerStoryOptionHighlightStyles) {
    return (action as ReturnType<typeof actions.setPlayerStoryOptionHighlightStyles>).style;
  }
  if (action.type === newStory.type) {
    return {};
  }
  if (action.type === persistence.actions.setFromLocalStorage) {
    const typedAction = action as ReturnType<typeof persistence.setFromLocalStorage>;

    if (typedAction.persistentState.playerStorySettings?.playerStoryOptionHighlightStyles) {
      return cleanLoadedTextStyle(typedAction.persistentState.playerStorySettings.playerStoryOptionHighlightStyles);
    }
  }

  return state;
};

const playerStoryOutputStyles = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setPlayerStoryOutputStyles) {
    return (action as ReturnType<typeof actions.setPlayerStoryOutputStyles>).style;
  }
  if (action.type === newStory.type) {
    return {};
  }
  if (action.type === persistence.actions.setFromLocalStorage) {
    const typedAction = action as ReturnType<typeof persistence.setFromLocalStorage>;

    if (typedAction.persistentState.playerStorySettings?.playerStoryOutputStyles) {
      return cleanLoadedTextStyle(typedAction.persistentState.playerStorySettings.playerStoryOutputStyles);
    }
  }

  return state;
};

const playerStoryRunnerOptions = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setPlayerStoryRunnerOptions) {
    return (action as ReturnType<typeof actions.setPlayerStoryRunnerOptions>).options;
  }
  if (action.type === newStory.type) {
    return {};
  }
  if (action.type === persistence.actions.setFromLocalStorage) {
    const typedAction = action as ReturnType<typeof persistence.setFromLocalStorage>;

    if (typedAction.persistentState.playerStorySettings?.playerStoryRunnerOptions) {
      return typedAction.persistentState.playerStorySettings.playerStoryRunnerOptions;
    }
  }

  return state;
};

const playerStoryRunnerStyles = (state = { background: { type: "plain" } }, action: IAction) => {
  if (action.type === actions.actions.setPlayerStoryRunnerStyles) {
    return (action as ReturnType<typeof actions.setPlayerStoryRunnerStyles>).style;
  }
  if (action.type === newStory.type) {
    return { background: { type: "plain" } };
  }
  if (action.type === persistence.actions.setFromLocalStorage) {
    const typedAction = action as ReturnType<typeof persistence.setFromLocalStorage>;

    if (typedAction.persistentState.playerStorySettings?.playerStoryRunnerStyles) {
      return typedAction.persistentState.playerStorySettings.playerStoryRunnerStyles;
    }
  }

  return state;
};

export const dispatchSetPlayerStoryInputStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setPlayerStoryInputStyles(style));
};

export const dispatchSetPlayerStoryLogSeparatorStyles =
  (dispatch: Dispatch) => (style: types.IRunnerLogSeparatorStyle) => {
    dispatch(actions.setPlayerStoryLogSeparatorStyles(style));
  };

export const dispatchSetPlayerStoryOptionStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setPlayerStoryOptionStyles(style));
};

export const dispatchSetPlayerStoryOptionHighlightStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setPlayerStoryOptionHighlightStyles(style));
};

export const dispatchSetPlayerStoryOutputStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setPlayerStoryOutputStyles(style));
};

export const dispatchSetPlayerStoryRunnerOptions = (dispatch: Dispatch) => (options: types.IPlayerRunnerOptions) => {
  dispatch(actions.setPlayerStoryRunnerOptions(options));
};

export const dispatchSetPlayerStoryRunnerStyles = (dispatch: Dispatch) => (style: types.IRunnerStyle) => {
  dispatch(actions.setPlayerStoryRunnerStyles(style));
};

// Combine reducers and typescript definition.
export interface IPlayerStorySettingsState {
  playerStoryInputStyles: types.ITextStyle;
  playerStoryLogSeparatorStyles: types.IRunnerLogSeparatorStyle;
  playerStoryOptionStyles: types.ITextStyle;
  playerStoryOptionHighlightStyles: types.ITextStyle;
  playerStoryOutputStyles: types.ITextStyle;
  playerStoryRunnerOptions: types.IPlayerRunnerOptions;
  playerStoryRunnerStyles: types.IRunnerStyle;
}

export const playerStorySettings = combineReducers({
  playerStoryInputStyles,
  playerStoryLogSeparatorStyles,
  playerStoryOptionStyles,
  playerStoryOptionHighlightStyles,
  playerStoryOutputStyles,
  playerStoryRunnerOptions,
  playerStoryRunnerStyles,
});
