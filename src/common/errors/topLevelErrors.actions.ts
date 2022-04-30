import { getActionGuid } from "../redux/reduxTools";

export const actions = {
  clearErrors: getActionGuid(),
  addError: getActionGuid(),
};

/** Deletes all top-level error messages. */
export const clearErrors = {
  type: actions.clearErrors,
};

/** Adds to the top-level errors list. */
export const addError = (error: string) => {
  return {
    error,
    type: actions.addError,
  };
};
