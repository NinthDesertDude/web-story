import { combineReducers, Dispatch } from "redux";
import {
  actions,
  IPersistentState,
  setCustomizationApplied,
  setFromLocalStorage,
  setUserConsentProvided,
} from "./persistence.actions";

/**
 * True if the user accepts the storage policy. Until the user accepts, data that isn't essential
 * for the operation of the site and any data that might be combined together across the site and
 * its services to create personally identifying info cannot be saved or loaded.
 *
 * This defaults to true because there is nothing requiring consent yet.
 */
const userConsentProvided = (state = true, action: ReturnType<typeof setUserConsentProvided>) => {
  if (action.type === actions.setUserConsentProvided) {
    return action.consentProvided;
  }

  return state;
};

/**
 * True if local storage customizations have been applied. An attempt to load should be made once
 * after the user has accepted the storage policy and changes to content.
 */
const customizationApplied = (state = false, action: ReturnType<typeof setCustomizationApplied>) => {
  if (action.type === actions.setCustomizationApplied) {
    return action.isApplied;
  }

  return state;
};

/** Sets the locale id in lowercase, such as en-us. */
export const dispatchSetCustomizationApplied = (dispatch: Dispatch) => (isCustomizationApplied: boolean) => {
  dispatch(setCustomizationApplied(isCustomizationApplied));
};

export const dispatchSetFromLocalStorage = (dispatch: Dispatch) => (state: Partial<IPersistentState>) => {
  dispatch(setFromLocalStorage(state));
};

/** Sets whether the user has consented to the storage policy. */
export const dispatchSetUserConsentProvided = (dispatch: Dispatch) => (isConsentGiven: boolean) => {
  dispatch(setUserConsentProvided(isConsentGiven));
};

// Combine reducers and typescript definition.
export interface IPersistenceState {
  customizationApplied: boolean;
  userConsentProvided: boolean;
}

export const persistence = combineReducers({
  customizationApplied,
  userConsentProvided,
});
