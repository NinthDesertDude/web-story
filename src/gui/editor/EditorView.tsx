import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { idEditorInputfield } from "../../common/identifiers";
import { dispatchSaveAndRunStory, dispatchSetStory } from "./viewedit.reducers";
import { IRootState } from "../../store";
import { editorTextAreaStyle } from "../../common/styles/controlStyles";
import { PrimaryButton } from "@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton";
import { getStrings } from "../../common/localization/Localization";

const mapStateToProps = (state: IRootState) => {
  return {
    story: state.viewEdit.story,
    strings: getStrings(state.settings.locale),
    theme: state.settings.theme,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    saveAndRunStory: dispatchSaveAndRunStory(dispatch),
    setStory: dispatchSetStory(dispatch),
  };
};

export type EditorViewOwnProps = {};

type CombinedProps = EditorViewOwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class EditorViewC extends React.Component<EditorViewOwnProps> {
  public componentDidUpdate(prevProps: EditorViewOwnProps) {
    if ((this.props as CombinedProps).story !== (prevProps as CombinedProps).story) {
      const textArea = document.getElementById(idEditorInputfield) as HTMLTextAreaElement | undefined;

      if (textArea) {
        textArea.value = (this.props as CombinedProps).story;
      }
    }
  }

  /** Saves the story automatically when switching away from the page that renders the editor view. */
  public componentWillUnmount() {
    const currentStory = (document.getElementById(idEditorInputfield) as HTMLTextAreaElement).value;

    if ((this.props as CombinedProps).story !== currentStory) {
      (this.props as CombinedProps).setStory(currentStory);
    }
  }

  public render() {
    const combinedProps = this.props as CombinedProps;

    return (
      <>
        <textarea
          defaultValue={(this.props as CombinedProps).story}
          style={editorTextAreaStyle((this.props as CombinedProps).theme.theme)}
          id={idEditorInputfield}
          onBlur={this.updateStory}
        />
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <PrimaryButton
            styles={{ root: { display: "block" } }}
            text={combinedProps.strings.EditorPlay}
            onClick={this.runStory}
          />
        </div>
      </>
    );
  }

  private runStory = () => {
    const currentStory = (document.getElementById(idEditorInputfield) as HTMLTextAreaElement).value;
    (this.props as CombinedProps).saveAndRunStory(currentStory);
  };

  private updateStory = (ev: React.FocusEvent<HTMLTextAreaElement>) => {
    if ((this.props as CombinedProps).story !== ev.currentTarget.value) {
      (this.props as CombinedProps).setStory(ev.currentTarget.value);
    }
  };
}

export const EditorView = connect(mapStateToProps, mapDispatchToProps)(EditorViewC);
