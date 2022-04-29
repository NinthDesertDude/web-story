import { getActionGuid } from "../../common/redux/reduxTools";

export const actions = {
  newStory: getActionGuid(),
  rerenderStory: getActionGuid(),
  saveAndRunStory: getActionGuid(),
  updateStory: getActionGuid(),
};

/** Starts a new story, resetting all values to default. */
export const newStory = {
  type: actions.newStory,
};

/** Re-renders the visual state of the interpreter.  */
export const rerenderStory = {
  type: actions.rerenderStory,
};

/** Runs the story and save as needed. */
export const saveAndRunStory = (story: string) => {
  return {
    story,
    type: actions.saveAndRunStory,
  };
};

/** Updates the contents of the story. */
export const updateStory = (story: string) => {
  return {
    story,
    type: actions.updateStory,
  };
};
