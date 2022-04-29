import { getActionGuid } from "../../common/redux/reduxTools";
import { ITextStyleColors } from "../../common/redux/typedefs";
import { IPlayerStorySettingsState } from "./playerStorySettings.reducers";

export const actions = {
  openColorPicker: getActionGuid(),
  closeColorPicker: getActionGuid(),
};

/** Opens the color picker to change a color. */
export const openColorPicker = (color: keyof ITextStyleColors, forStyle: keyof IPlayerStorySettingsState) => {
  return {
    color,
    forStyle,
    type: actions.openColorPicker,
  };
};

/* Closes the color picker. */
export const closeColorPicker = {
  type: actions.closeColorPicker,
};
