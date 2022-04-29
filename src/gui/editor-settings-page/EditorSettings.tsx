import * as React from "react";
import { connect } from "react-redux";
import { IRootState } from "../../store";

const mapStateToProps = (state: IRootState) => {
  return {};
};

type EditorSettingsOwnProps = {};
type CombinedProps = EditorSettingsOwnProps & ReturnType<typeof mapStateToProps>;

export class EditorSettingsC extends React.Component<EditorSettingsOwnProps> {
  public render() {
    // TODO: replace with settings
    return <p>Editor Settings</p>;
  }
}

export const EditorSettings = connect(mapStateToProps)(EditorSettingsC);
