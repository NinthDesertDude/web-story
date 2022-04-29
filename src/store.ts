import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { ISettingState, settings } from "./common/settings/settings.reducers";
import { IPersistenceState, persistence } from "./common/storage/persistence.reducers";
import { IViewEditState, viewEdit } from "./gui/editor/viewedit.reducers";
import {
  IAuthorStorySettingsState,
  authorStorySettings,
} from "./gui/editor-settings-page/authorStorySettings.reducers";
import {
  IPlayerStorySettingsState,
  playerStorySettings,
} from "./gui/runner-settings-page/playerStorySettings.reducers";
import {
  ICurrentRunnerSettingsState,
  currentRunnerSettings,
} from "./gui/editor-settings-page/currentRunnerSettings.reducers";
import { IRunnerSettingsState, runnerSettings } from "./gui/runner-settings-page/runnerSettings.reducers";

/** All reducers. */
export interface IRootState {
  persistence: IPersistenceState;
  settings: ISettingState;
  viewEdit: IViewEditState;
  authorStorySettings: IAuthorStorySettingsState;
  currentRunnerSettings: ICurrentRunnerSettingsState;
  playerStorySettings: IPlayerStorySettingsState;
  runnerSettings: IRunnerSettingsState;
}

const rootReducer = combineReducers({
  persistence,
  settings,
  viewEdit,
  authorStorySettings,
  currentRunnerSettings,
  playerStorySettings,
  runnerSettings,
});

/** Provides global access to the static Redux store. */
export const store = createStore(rootReducer, undefined, applyMiddleware(thunk));
