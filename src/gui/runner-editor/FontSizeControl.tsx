import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store";
import { ITextStyle } from "../../common/redux/typedefs";
import {
  dispatchSetPlayerStoryInputStyles,
  dispatchSetPlayerStoryOptionHighlightStyles,
  dispatchSetPlayerStoryOptionStyles,
  dispatchSetPlayerStoryOutputStyles,
} from "../runner-settings-page/playerStorySettings.reducers";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/components/Dropdown";
import { SpinButton } from "@fluentui/react/lib/components/SpinButton";
import { getStrings } from "../../common/localization/Localization";
import { Position } from "@fluentui/react";

const mapStateToProps = (state: IRootState) => {
  return {
    playerStoryInputStyles: state.playerStorySettings.playerStoryInputStyles,
    playerStoryOptionStyles: state.playerStorySettings.playerStoryOptionStyles,
    playerStoryOptionHighlightStyles: state.playerStorySettings.playerStoryOptionHighlightStyles,
    playerStoryOutputStyles: state.playerStorySettings.playerStoryOutputStyles,
    strings: getStrings(state.settings.locale),
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

const fontTypeRegex = /px|rem/g;

/** The allowed units a font size may be specified in. */
const fontSizeUnits = {
  px: "px",
  rem: "rem",
};

const fontSizeObjects = {
  [fontSizeUnits.px]: {
    default: 12,
    max: 96,
    min: 4,
    step: 1,
  },
  [fontSizeUnits.rem]: {
    default: 1.2,
    max: 6,
    min: 0.1,
    step: 0.1,
  },
};

type FontSizeControlOwnProps = {
  chosenDispatchCall: (style: ITextStyle) => void;
  chosenStyle: ITextStyle;
  forStyle: string;
};

enum FontSizeControlAction {
  Decrement,
  Increment,
  TextEdited,
}

type CombinedProps = FontSizeControlOwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class FontSizeControlC extends React.Component<FontSizeControlOwnProps> {
  public render() {
    const combinedProps = this.props as CombinedProps;

    const fontSizeUnit = combinedProps.chosenStyle.fontSize?.endsWith(fontSizeUnits.px)
      ? fontSizeUnits.px
      : fontSizeUnits.rem;

    const fontSizeOrigValue = combinedProps.chosenStyle.fontSize
      ? fontSizeUnit === fontSizeUnits.px
        ? Number.parseInt(combinedProps.chosenStyle.fontSize.replaceAll(fontTypeRegex, ""), 10)
        : Math.round(Number.parseFloat(combinedProps.chosenStyle.fontSize.replaceAll(fontTypeRegex, "")) * 10) / 10
      : undefined;

    return (
      <span style={{ display: "inline-flex", marginLeft: "4px", maxWidth: "14rem" }}>
        <SpinButton
          ariaLabel={combinedProps.strings.SettingsControlFontSizeSpinButtonAria}
          decrementButtonAriaLabel={combinedProps.strings.SettingsControlFontSizeSpinButtonDecrAria}
          incrementButtonAriaLabel={combinedProps.strings.SettingsControlFontSizeSpinButtonIncrAria}
          label={combinedProps.strings.SettingsControlFontSizeSpinButtonLabel}
          labelPosition={Position.top}
          max={fontSizeObjects[fontSizeUnit].max}
          min={fontSizeObjects[fontSizeUnit].min}
          onDecrement={this.fontSizeChanged(FontSizeControlAction.Decrement)}
          onIncrement={this.fontSizeChanged(FontSizeControlAction.Increment)}
          onValidate={this.fontSizeChanged(FontSizeControlAction.TextEdited)}
          step={fontSizeObjects[fontSizeUnit].step}
          styles={{ root: { width: "1px" } }} // shrink to minimum width
          value={fontSizeOrigValue?.toString() ?? combinedProps.strings.SettingsControlFontSizeSpinButtonUnset}
        />
        <Dropdown
          aria-label={combinedProps.strings.SettingsControlFontSizeDropdownLabel}
          dropdownWidth="auto"
          onChange={this.fontUnitChanged}
          options={[
            {
              data: fontSizeUnits.rem,
              key: `settingsFontSize${fontSizeUnits.rem}-${combinedProps.forStyle}`,
              text: combinedProps.strings.SettingsControlFontSizeDropdownRemsLabel,
              title: combinedProps.strings.SettingsControlFontSizeDropdownRemsTitle,
            },
            {
              data: fontSizeUnits.px,
              key: `settingsFontSize${fontSizeUnits.px}-${combinedProps.forStyle}`,
              text: combinedProps.strings.SettingsControlFontSizeDropdownPixelsLabel,
              title: combinedProps.strings.SettingsControlFontSizeDropdownPixelsTitle,
            },
          ]}
          selectedKey={`settingsFontSize${fontSizeUnit}-${combinedProps.forStyle}`}
          styles={{ root: { alignSelf: "flex-end" } }}
        />
      </span>
    );
  }

  /** Handles font size changes from spin buttons, or from direct textfield editing. */
  private fontSizeChanged = (action: FontSizeControlAction) => (fontSize: string) => {
    const combinedProps = this.props as CombinedProps;
    const fontSizeUnit = combinedProps.chosenStyle.fontSize?.endsWith(fontSizeUnits.px)
      ? fontSizeUnits.px
      : fontSizeUnits.rem;

    const fontSizeValue =
      fontSizeUnit === fontSizeUnits.px
        ? Number.parseInt(fontSize, 10)
        : Math.round(Number.parseFloat(fontSize) * 100) / 100;

    // Resets invalid values to be valid
    // Clears the set value for empty strings
    if (fontSize === "" || fontSize === combinedProps.strings.SettingsControlFontSizeSpinButtonUnset) {
      if (action !== FontSizeControlAction.TextEdited) {
        combinedProps.chosenDispatchCall({
          ...combinedProps.chosenStyle,
          fontSize: `${fontSizeObjects[fontSizeUnit].default}${fontSizeUnit}`,
        });
      } else {
        combinedProps.chosenDispatchCall({
          ...combinedProps.chosenStyle,
          fontSize: undefined,
        });
      }
    }

    // Handles increment and decrement
    else if (action !== FontSizeControlAction.TextEdited) {
      if (action === FontSizeControlAction.Increment && fontSizeValue < fontSizeObjects[fontSizeUnit].max) {
        combinedProps.chosenDispatchCall({
          ...combinedProps.chosenStyle,
          fontSize: `${Math.min(
            fontSizeValue + fontSizeObjects[fontSizeUnit].step,
            fontSizeObjects[fontSizeUnit].max
          )}${fontSizeUnit}`,
        });
      } else if (action === FontSizeControlAction.Decrement && fontSizeValue > fontSizeObjects[fontSizeUnit].min) {
        combinedProps.chosenDispatchCall({
          ...combinedProps.chosenStyle,
          fontSize: `${Math.max(
            fontSizeValue - fontSizeObjects[fontSizeUnit].step,
            fontSizeObjects[fontSizeUnit].min
          )}${fontSizeUnit}`,
        });
      }
    }

    // Handles written-in values
    else if (fontSize === fontSizeValue.toString()) {
      if (fontSizeValue >= fontSizeObjects[fontSizeUnit].min && fontSizeValue <= fontSizeObjects[fontSizeUnit].max) {
        combinedProps.chosenDispatchCall({
          ...combinedProps.chosenStyle,
          fontSize: `${fontSizeValue}${fontSizeUnit}`,
        });
      } else if (fontSizeValue < fontSizeObjects[fontSizeUnit].min) {
        combinedProps.chosenDispatchCall({
          ...combinedProps.chosenStyle,
          fontSize: `${fontSizeObjects[fontSizeUnit].min}${fontSizeUnit}`,
        });
      } else if (fontSizeValue > fontSizeObjects[fontSizeUnit].max) {
        combinedProps.chosenDispatchCall({
          ...combinedProps.chosenStyle,
          fontSize: `${fontSizeObjects[fontSizeUnit].max}${fontSizeUnit}`,
        });
      }
    }
  };

  /** Updates redux for the chosen font size unit. */
  private fontUnitChanged = (_: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (!option) {
      return;
    }

    const combinedProps = this.props as CombinedProps;

    const fontSizeOrigValue = combinedProps.chosenStyle.fontSize
      ? option!.data === fontSizeUnits.px
        ? Number.parseInt(combinedProps.chosenStyle.fontSize.replaceAll(fontTypeRegex, ""), 10)
        : Math.round(Number.parseFloat(combinedProps.chosenStyle.fontSize.replaceAll(fontTypeRegex, "")) * 10) / 10
      : undefined;

    let value = fontSizeOrigValue ?? fontSizeObjects[option.data].default;
    value = Math.min(Math.max(value, fontSizeObjects[option.data].min), fontSizeObjects[option.data].max);

    combinedProps.chosenDispatchCall({
      ...combinedProps.chosenStyle,
      fontSize: `${value}${option.data}`,
    });
  };
}

/** A textbox and dropdown for setting font size and units; respectively. */
export const FontSizeControl = connect(mapStateToProps, mapDispatchToProps)(FontSizeControlC);
