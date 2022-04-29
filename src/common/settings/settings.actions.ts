import { ILocalizedStringSets } from "../localization/Localization";
import { getActionGuid } from "../redux/reduxTools";
import { ISupportedTheme } from "../themes";

export const actions = {
  setLocale: getActionGuid(),
  setTheme: getActionGuid(),
};

/** Action creator to store name of preferred color theme. */
export const setTheme = (theme: ISupportedTheme) => {
  return {
    theme,
    type: actions.setTheme,
  };
};

/** Action creator to store (lowercase) preferred locale id such as en-us. */
export const setLocale = (localeId: keyof ILocalizedStringSets) => {
  return {
    localeId,
    type: actions.setLocale,
  };
};
