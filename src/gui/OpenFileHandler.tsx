import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { dispatchRerenderStory, dispatchSaveAndRunStory, dispatchSetStory } from "./editor/viewedit.reducers";
import { isPlayMode } from "../common/routing/Routing";
import { hiddenAndInaccessible } from "../common/styles/controlStyles";

/** A callback function after data loads that can be set from command invocation */
let onLoadedCallback: Function | undefined;

/**
 * Browsers require a click to invoke an open file dialog, so this invokes a click on a hidden
 * input element rendered as part of the main command bar. This enables seamless functionality.
 */
export function invokeOpenCommand(afterLoadedCallback?: Function) {
  onLoadedCallback = afterLoadedCallback;
  hiddenInputRef.current?.click();
}

/** Browsers require a click event on an input control, which is automatically done via this one. */
const hiddenInputRef = React.createRef<HTMLInputElement>();

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    reRenderStory: dispatchRerenderStory(dispatch),
    saveAndRunStory: dispatchSaveAndRunStory(dispatch),
    setStory: dispatchSetStory(dispatch),
  };
};

export type OpenFileHandlerOwnProps = {};
type CombinedProps = OpenFileHandlerOwnProps & ReturnType<typeof mapDispatchToProps>;

export class OpenFileHandlerC extends React.Component<OpenFileHandlerOwnProps> {
  public render() {
    /** Loads the given file to a string for parsing. */
    const handleFile = async (ev: React.ChangeEvent<HTMLInputElement>) => {
      const chosenFiles = ev.target.files;

      if (chosenFiles) {
        const fileReader = new FileReader();

        fileReader.onloadend = () => {
          const result = fileReader.result as string;

          if (isPlayMode()) {
            (this.props as CombinedProps).saveAndRunStory(result);
          } else {
            (this.props as CombinedProps).setStory(result);
          }

          ev.target.value = ""; // Avoids having the browser ignore trying to load the same file twice in a row

          if (onLoadedCallback) {
            onLoadedCallback();
            onLoadedCallback = undefined;
          }
        };

        fileReader.onabort = () => {
          onLoadedCallback = undefined;
        };

        if (chosenFiles[0] instanceof Blob) {
          fileReader.readAsText(chosenFiles[0]);
        }
      }
    };

    return <input className={hiddenAndInaccessible} onChange={handleFile} ref={hiddenInputRef} type="file" />;
  }
}

export const OpenFileHandler = connect(null, mapDispatchToProps)(OpenFileHandlerC);
