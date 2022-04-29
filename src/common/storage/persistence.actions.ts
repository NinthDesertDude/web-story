import { IRootState } from "../../store";
import { getActionGuid } from "../redux/reduxTools";
import { themes } from "../themes";

/** The object states to persist to local storage. */
export interface IPersistentState {
  locale: IRootState["settings"]["locale"];
  playerStorySettings: IRootState["playerStorySettings"];
  saveFormatVersion: number;
  theme: keyof typeof themes;
}

export const actions = {
  setCustomizationApplied: getActionGuid(),
  setFromLocalStorage: getActionGuid(),
  setUserConsentProvided: getActionGuid(),
};

/** Action creator to store whether the user has provided consent to using local storage. */
export const setUserConsentProvided = (consentProvided: boolean) => {
  return {
    consentProvided,
    type: actions.setUserConsentProvided,
  };
};

/** Action creator to store (lowercase) preferred locale id such as en-us. */
export const setCustomizationApplied = (isApplied: boolean) => {
  return {
    isApplied,
    type: actions.setCustomizationApplied,
  };
};

/** Loads settings saved to localstorage, provided the user has consented to store it. */
export const setFromLocalStorage = (persistentState: Partial<IPersistentState>) => {
  return {
    persistentState,
    type: actions.setFromLocalStorage,
  };
};
