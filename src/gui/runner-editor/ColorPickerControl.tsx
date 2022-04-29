import { Label } from "@fluentui/react";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { getStrings } from "../../common/localization/Localization";
import { IRootState } from "../../store";
import { ITextStyle, ITextStyleColors } from "../../common/redux/typedefs";
import { IPlayerStorySettingsState } from "../runner-settings-page/playerStorySettings.reducers";
import { dispatchCloseColorPicker, dispatchOpenColorPicker } from "../runner-settings-page/runnerSettings.reducers";

const mapStateToProps = (state: IRootState) => {
  return {
    colorPickerOpenId: state.runnerSettings.colorPickerOpenId,
    strings: getStrings(state.settings.locale),
    theme: state.settings.theme,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    dispatchCloseColorPicker: dispatchCloseColorPicker(dispatch),
    dispatchOpenColorPicker: dispatchOpenColorPicker(dispatch),
  };
};

type ColorPickerControlOwnProps = {
  forStyle: keyof IPlayerStorySettingsState;
  textStyleObj: ITextStyle;
  update: (style: ITextStyle) => void;
};

type CombinedProps = ColorPickerControlOwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class ColorPickerControlC extends React.Component<ColorPickerControlOwnProps> {
  public render() {
    const combinedProps = this.props as CombinedProps;

    return (
      <div style={{ display: "inline-flex", flexDirection: "column" }}>
        <div style={{ alignItems: "center", display: "flex", flexDirection: "row" }}>
          <button
            onClick={this.onSwatchClicked("colorLight", this.props.forStyle)}
            style={{
              backgroundColor: this.props.textStyleObj.colorLight,
              border: combinedProps.theme.theme.semanticColors.buttonBorder,
              height: "2rem",
              margin: combinedProps.theme.theme.spacing.s2,
              width: "2rem",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Label style={{ paddingTop: 0 }}>{combinedProps.strings.SettingsTextStyleLightColor}</Label>
            <input
              onChange={this.onChange("colorLight")}
              placeholder={combinedProps.strings.SettingsTextStyleColorUnset}
              type="text"
              value={this.props.textStyleObj.colorLight}
            />
          </div>
        </div>
        <div style={{ alignItems: "center", display: "flex", flexDirection: "row" }}>
          <button
            onClick={this.onSwatchClicked("colorDark", this.props.forStyle)}
            style={{
              backgroundColor: this.props.textStyleObj.colorDark,
              border: combinedProps.theme.theme.semanticColors.buttonBorder,
              height: "2rem",
              margin: combinedProps.theme.theme.spacing.s2,
              width: "2rem",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Label style={{ paddingTop: 0 }}>{combinedProps.strings.SettingsTextStyleDarkColor}</Label>
            <input
              onChange={this.onChange("colorDark")}
              placeholder={combinedProps.strings.SettingsTextStyleColorUnset}
              type="text"
              value={this.props.textStyleObj.colorDark}
            />
          </div>
        </div>
        <div style={{ alignItems: "center", display: "flex", flexDirection: "row" }}>
          <button
            onClick={this.onSwatchClicked("colorHighlightLight", this.props.forStyle)}
            style={{
              backgroundColor: this.props.textStyleObj.colorHighlightLight,
              border: combinedProps.theme.theme.semanticColors.buttonBorder,
              height: "2rem",
              margin: combinedProps.theme.theme.spacing.s2,
              width: "2rem",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Label style={{ paddingTop: 0 }}>{combinedProps.strings.SettingsTextStyleHighlightLightColor}</Label>
            <input
              onChange={this.onChange("colorHighlightLight")}
              placeholder={combinedProps.strings.SettingsTextStyleColorUnset}
              type="text"
              value={this.props.textStyleObj.colorHighlightLight}
            />
          </div>
        </div>
        <div style={{ alignItems: "center", display: "flex", flexDirection: "row" }}>
          <button
            onClick={this.onSwatchClicked("colorHighlightDark", this.props.forStyle)}
            style={{
              backgroundColor: this.props.textStyleObj.colorHighlightDark,
              border: combinedProps.theme.theme.semanticColors.buttonBorder,
              height: "2rem",
              margin: combinedProps.theme.theme.spacing.s2,
              width: "2rem",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Label style={{ paddingTop: 0 }}>{combinedProps.strings.SettingsTextStyleHighlightDarkColor}</Label>
            <input
              onChange={this.onChange("colorHighlightDark")}
              placeholder={combinedProps.strings.SettingsTextStyleColorUnset}
              type="text"
              value={this.props.textStyleObj.colorHighlightDark}
            />
          </div>
        </div>
      </div>
    );
  }

  /** Updates when the hex field is directly edited. */
  private onChange = (updateKey: keyof ITextStyleColors) => (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.props.update({
      ...this.props.textStyleObj,
      [updateKey]: ev.target.value,
    });
  };

  /** Toggles the color picker's open state when clicking the swatch. */
  private onSwatchClicked = (color: keyof ITextStyleColors, forStyle: keyof IPlayerStorySettingsState) => () => {
    const combinedProps = this.props as CombinedProps;

    if (combinedProps.colorPickerOpenId?.forStyle === forStyle && combinedProps.colorPickerOpenId?.color === color) {
      combinedProps.dispatchCloseColorPicker();
    } else {
      combinedProps.dispatchOpenColorPicker(color, forStyle);
    }
  };
}

/** A swatch button and text field to control setting a color or entering it by name. */
export const ColorPickerControl = connect(mapStateToProps, mapDispatchToProps)(ColorPickerControlC);
