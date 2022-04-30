import { combineReducers, Dispatch } from "redux";
import { IAction } from "../redux/reduxTools";
import { actions, addError, clearErrors } from "./topLevelErrors.actions";

/**
 * Contains all error messages displayed at the top level of the application, e.g. issues with
 * loading resources, caught exceptions, etc.
 */
const errorMessages = (state: string[] = [], action: IAction) => {
  if (action.type === actions.clearErrors) {
    return [];
  }
  if (action.type === actions.addError) {
    return [...state, (action as ReturnType<typeof addError>).error];
  }

  return state;
};

/** Clears all story-related states. */
export const dispatchClearErrors = (dispatch: Dispatch) => {
  dispatch(clearErrors);
};

/** Appends an error message to the list. */
export const dispatchAddError = (dispatch: Dispatch) => (error: string) => {
  dispatch(addError(error));
};

// Combine reducers and typescript definition.
export interface ITopLevelErrorsState {
  errorMessages: string[];
}

export const topLevelErrors = combineReducers({
  errorMessages,
});
