import { Slider } from "@fluentui/react";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { getStrings } from "../../common/localization/Localization";
import { ITextStyle } from "../../common/redux/typedefs";
import { IRootState } from "../../store";
import {
  dispatchSetPlayerStoryInputStyles,
  dispatchSetPlayerStoryOptionHighlightStyles,
  dispatchSetPlayerStoryOptionStyles,
  dispatchSetPlayerStoryOutputStyles,
} from "../runner-settings-page/playerStorySettings.reducers";

const mapStateToProps = (state: IRootState) => {
  return {
    playerStoryInputStyles: state.playerStorySettings.playerStoryInputStyles,
    playerStoryOptionStyles: state.playerStorySettings.playerStoryOptionStyles,
    playerStoryOptionHighlightStyles: state.playerStorySettings.playerStoryOptionHighlightStyles,
    playerStoryOutputStyles: state.playerStorySettings.playerStoryOutputStyles,
    strings: getStrings(state.settings.locale),
    theme: state.settings.theme,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    dispatchInputStyles: dispatchSetPlayerStoryInputStyles(dispatch),
    dispatchOptionHighlightStyles: dispatchSetPlayerStoryOptionHighlightStyles(dispatch),
    dispatchOptionStyles: dispatchSetPlayerStoryOptionStyles(dispatch),
    dispatchOutputStyles: dispatchSetPlayerStoryOutputStyles(dispatch),
  };
};

enum StyleType {
  Italic,
  Bold,
  Underline,
  Strikethrough,
}

type FontStyleControlOwnProps = {
  chosenDispatchCall: (style: ITextStyle) => void;
  chosenStyle: ITextStyle;
};

type CombinedProps = FontStyleControlOwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class FontStyleControlC extends React.Component<FontStyleControlOwnProps> {
  /** Renders color boxes to adjust the light/dark theme settings for one of the override styles. */
  public render() {
    const combinedProps = this.props as CombinedProps;

    return (
      <div style={{ display: "flex", flexDirection: "column", marginLeft: "4rem", width: "9rem" }}>
        <Slider
          max={2}
          min={0}
          label={combinedProps.strings.SettingsControlFontStyleItalic}
          onChange={this.fontStyleChanged(StyleType.Italic)}
          styles={{ titleLabel: { fontSize: combinedProps.theme.theme.fonts.small.fontSize } }}
          value={this.getValue(combinedProps.chosenStyle.styleItalic)}
          valueFormat={this.formatDisplayText}
        />
        <Slider
          max={2}
          min={0}
          label={combinedProps.strings.SettingsControlFontStyleBold}
          onChange={this.fontStyleChanged(StyleType.Bold)}
          styles={{ titleLabel: { fontSize: combinedProps.theme.theme.fonts.small.fontSize } }}
          value={this.getValue(combinedProps.chosenStyle.styleBold)}
          valueFormat={this.formatDisplayText}
        />
        <Slider
          max={2}
          min={0}
          label={combinedProps.strings.SettingsControlFontStyleUnderline}
          onChange={this.fontStyleChanged(StyleType.Underline)}
          styles={{ titleLabel: { fontSize: combinedProps.theme.theme.fonts.small.fontSize } }}
          value={this.getValue(combinedProps.chosenStyle.styleUnderline)}
          valueFormat={this.formatDisplayText}
        />
        <Slider
          max={2}
          min={0}
          label={combinedProps.strings.SettingsControlFontStyleStrikethrough}
          onChange={this.fontStyleChanged(StyleType.Strikethrough)}
          styles={{ titleLabel: { fontSize: combinedProps.theme.theme.fonts.small.fontSize } }}
          value={this.getValue(combinedProps.chosenStyle.styleStrikethrough)}
          valueFormat={this.formatDisplayText}
        />
      </div>
    );
  }

  /** Converts the boolean value to a numeric value for the slider. */
  private getValue = (value?: boolean) => {
    return value === undefined ? 1 : value ? 2 : 0;
  };

  /** Gets a reasonable label for the numeric slider value. */
  private formatDisplayText = (value: number) => {
    const combinedProps = this.props as CombinedProps;

    if (value === 0) {
      return combinedProps.strings.SettingsControlFontStyleSliderOff;
    }
    if (value === 2) {
      return combinedProps.strings.SettingsControlFontStyleSliderOn;
    }

    return combinedProps.strings.SettingsControlFontStyleSliderUnset;
  };

  /** Updates redux with the chosen style. */
  private fontStyleChanged = (styleType: StyleType) => (value: number) => {
    const combinedProps = this.props as CombinedProps;
    const booleanValue = value === 2 ? true : value === 1 ? undefined : false;

    combinedProps.chosenDispatchCall({
      ...combinedProps.chosenStyle,
      styleBold: styleType === StyleType.Bold ? booleanValue : combinedProps.chosenStyle.styleBold,
      styleItalic: styleType === StyleType.Italic ? booleanValue : combinedProps.chosenStyle.styleItalic,
      styleStrikethrough:
        styleType === StyleType.Strikethrough ? booleanValue : combinedProps.chosenStyle.styleStrikethrough,
      styleUnderline: styleType === StyleType.Underline ? booleanValue : combinedProps.chosenStyle.styleUnderline,
    });
  };
}

export const FontStyleControl = connect(mapStateToProps, mapDispatchToProps)(FontStyleControlC);
