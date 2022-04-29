import { combineReducers, Dispatch } from "redux";
import * as actions from "./runnerSettings.actions";
import { IAction } from "../../common/redux/reduxTools";
import { IPlayerStorySettingsState } from "./playerStorySettings.reducers";
import { ITextStyleColors } from "../../common/redux/typedefs";

const colorPickerOpenId = (state = null, action: IAction) => {
  if (action.type === actions.actions.openColorPicker) {
    return action as ReturnType<typeof actions.openColorPicker>;
  }
  if (action.type === actions.actions.closeColorPicker) {
    return null;
  }

  return state;
};

export const dispatchOpenColorPicker =
  (dispatch: Dispatch) => (color: keyof ITextStyleColors, style: keyof IPlayerStorySettingsState) => {
    dispatch(actions.openColorPicker(color, style));
  };

export const dispatchCloseColorPicker = (dispatch: Dispatch) => () => {
  dispatch(actions.closeColorPicker);
};

// Combine reducers and typescript definition.
export interface IRunnerSettingsState {
  colorPickerOpenId: ReturnType<typeof actions.openColorPicker>;
}

export const runnerSettings = combineReducers({
  colorPickerOpenId,
});
