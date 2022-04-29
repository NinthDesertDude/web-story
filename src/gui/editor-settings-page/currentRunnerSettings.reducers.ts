import { combineReducers, Dispatch } from "redux";
import * as actions from "./currentRunnerSettings.actions";
import { IAction } from "../../common/redux/reduxTools";
import * as types from "../../common/redux/typedefs";
import { newStory } from "../editor/viewedit.actions";

const currentRunnerOptions = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setCurrentRunnerOptions) {
    return (action as ReturnType<typeof actions.setCurrentRunnerOptions>).options;
  }
  if (action.type === actions.actions.clearAllTempSettings) {
    return {};
  }
  if (action.type === newStory.type) {
    return {};
  }

  return state;
};

export const dispatchClearAllTempSettings = (dispatch: Dispatch) => {
  dispatch(actions.clearAllTempSettings);
};

export const dispatchSetTempStoryRunnerOptions = (dispatch: Dispatch) => (options: types.IAuthorRunnerOptions) => {
  dispatch(actions.setCurrentRunnerOptions(options));
};

// Combine reducers and typescript definition.
export interface ICurrentRunnerSettingsState {
  currentRunnerOptions: types.IAuthorRunnerOptions;
}

export const currentRunnerSettings = combineReducers({
  currentRunnerOptions,
});
