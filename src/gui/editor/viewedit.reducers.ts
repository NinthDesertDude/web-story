import { combineReducers, Dispatch } from "redux";
import { IAction } from "../../common/redux/reduxTools";
import { actions, updateStory, saveAndRunStory, rerenderStory, newStory } from "./viewedit.actions";

/**
 * Contains the up-to-date text for the story, which is updated when loading a story, adding to
 * it with GUI controls, trying to run the story after editing the source, or blurring the textarea
 * after editing the source.
 */
const story = (state = "", action: IAction) => {
  if (action.type === actions.updateStory) {
    return (action as ReturnType<typeof updateStory>).story;
  }
  if (action.type === actions.saveAndRunStory) {
    return (action as ReturnType<typeof saveAndRunStory>).story;
  }
  if (action.type === actions.newStory) {
    return "";
  }

  return state;
};

/**
 * Contains the copy of the story from when it was last executed, which may be older than the
 * current story. Updating this causes the story to execute again.
 */
const storyToParse = (state = "", action: IAction) => {
  if (action.type === actions.saveAndRunStory) {
    return (action as ReturnType<typeof saveAndRunStory>).story;
  }
  if (action.type === actions.newStory) {
    return "";
  }

  return state;
};

/**
 * Uses a number to indicate that the story should be parsed again. Necessary because there is no good way to pass the
 * action from the editor to runner, and restarting without the story text changing is a common operation.
 */
const storyReparseToken = (state = 0, action: IAction) => {
  if (action.type === actions.saveAndRunStory) {
    return state + 1;
  }

  return state;
};

/**
 * Uses a number to indicate that the runner should re-render. The alternative is to re-render any time output, input,
 * and logs change, which gets up to 20-30 re-renders per new page. Instead, increment this when the page is done.
 */
const storyRerenderToken = (state = 0, action: IAction) => {
  if (action.type === actions.rerenderStory) {
    return state + 1;
  }

  return state;
};

/** Clears all story-related states. */
export const dispatchNewStory = (dispatch: Dispatch) => {
  dispatch(newStory);
};

/** Sets the story that the user has typed. */
export const dispatchSetStory = (dispatch: Dispatch) => (story: string) => {
  dispatch(updateStory(story));
};

/** Parses the story as currently written, updating the stored story to match the provided string. */
export const dispatchSaveAndRunStory = (dispatch: Dispatch) => (story: string) => {
  dispatch(saveAndRunStory(story));
};

/** Causes the story to re-render. */
export const dispatchRerenderStory = (dispatch: Dispatch) => () => {
  dispatch(rerenderStory);
};

// Combine reducers and typescript definition.
export interface IViewEditState {
  story: string;
  storyReparseToken: number;
  storyRerenderToken: number;
  storyToParse: string;
}

export const viewEdit = combineReducers({
  story,
  storyReparseToken,
  storyRerenderToken,
  storyToParse,
});
