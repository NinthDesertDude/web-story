import * as React from "react";
import { idEditorWrapper, idRunnerWrapper } from "../../common/identifiers";
import { mainViewWrapperStyle, mainViewEditorStyle, mainViewRunnerStyle } from "../../common/styles/controlStyles";
import { connect } from "react-redux";
import { IRootState } from "../../store";
import { EditorView } from "../editor/EditorView";
import { RunnerView } from "../runner/RunnerView";

const mapStateToProps = (state: IRootState) => {
  return {
    theme: state.settings.theme,
  };
};

export type RunnerEditorOwnProps = {};

type CombinedProps = RunnerEditorOwnProps & ReturnType<typeof mapStateToProps>;

export class RunnerEditorViewC extends React.Component<RunnerEditorOwnProps> {
  public render() {
    return (
      <>
        <div className={mainViewWrapperStyle}>
          <div id={idEditorWrapper} className={mainViewEditorStyle}>
            <EditorView />
          </div>
          <div id={idRunnerWrapper} style={mainViewRunnerStyle((this.props as CombinedProps).theme.theme) as object}>
            <RunnerView />
          </div>
        </div>
      </>
    );
  }
}

export const RunnerEditorView = connect(mapStateToProps)(RunnerEditorViewC);
