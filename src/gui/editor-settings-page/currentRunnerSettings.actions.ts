import { getActionGuid } from "../../common/redux/reduxTools";
import { IAuthorRunnerOptions } from "../../common/redux/typedefs";

export const actions = {
  clearAllTempSettings: getActionGuid(),
  setCurrentRunnerOptions: getActionGuid(),
};

/** Resets all temp settings to minimal defaults. */
export const clearAllTempSettings = {
  type: actions.clearAllTempSettings,
};

/**
 * Sets story options such as logging behavior.
 */
export const setCurrentRunnerOptions = (options: IAuthorRunnerOptions) => {
  return {
    type: actions.setCurrentRunnerOptions,
    options,
  };
};
