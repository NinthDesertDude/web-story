import { ColorPicker, IColor } from "@fluentui/react";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { getStrings } from "../../common/localization/Localization";
import {
  dispatchSetPlayerStoryInputStyles,
  dispatchSetPlayerStoryOptionHighlightStyles,
  dispatchSetPlayerStoryOptionStyles,
  dispatchSetPlayerStoryOutputStyles,
  dispatchSetPlayerStoryRunnerOptions,
} from "./playerStorySettings.reducers";
import { IRootState } from "../../store";
import { dispatchCloseColorPicker, dispatchOpenColorPicker } from "./runnerSettings.reducers";
import { ITextStyle, ITextStyleColors } from "../../common/redux/typedefs";
import { FontSizeControl } from "../runner-editor/FontSizeControl";
import { ColorPickerControl } from "../runner-editor/ColorPickerControl";
import { FontStyleControl } from "../runner-editor/FontStyleControl";
import { RunnerView } from "../runner/RunnerView";

const mapStateToProps = (state: IRootState) => {
  return {
    colorPickerOpenId: state.runnerSettings.colorPickerOpenId,
    playerStoryInputStyles: state.playerStorySettings.playerStoryInputStyles,
    playerStoryOptionStyles: state.playerStorySettings.playerStoryOptionStyles,
    playerStoryOptionHighlightStyles: state.playerStorySettings.playerStoryOptionHighlightStyles,
    playerStoryOutputStyles: state.playerStorySettings.playerStoryOutputStyles,
    playerStoryRunnerOptions: state.playerStorySettings.playerStoryRunnerOptions,
    strings: getStrings(state.settings.locale),
    theme: state.settings.theme,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    dispatchCloseColorPicker: dispatchCloseColorPicker(dispatch),
    dispatchInputStyles: dispatchSetPlayerStoryInputStyles(dispatch),
    dispatchOpenColorPicker: dispatchOpenColorPicker(dispatch),
    dispatchOptionHighlightStyles: dispatchSetPlayerStoryOptionHighlightStyles(dispatch),
    dispatchOptionStyles: dispatchSetPlayerStoryOptionStyles(dispatch),
    dispatchOutputStyles: dispatchSetPlayerStoryOutputStyles(dispatch),
    dispatchRunnerOptions: dispatchSetPlayerStoryRunnerOptions(dispatch),
  };
};

type RunnerSettingsOwnProps = {};
type CombinedProps = RunnerSettingsOwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class RunnerSettingsC extends React.Component<RunnerSettingsOwnProps> {
  public componentWillUnmount() {
    (this.props as CombinedProps).dispatchCloseColorPicker();
  }

  public render() {
    const combinedProps = this.props as CombinedProps;

    return (
      <>
        <div style={{ display: "flex" }}>
          <div style={{ marginLeft: "1rem", maxWidth: "50rem", width: "75%" }}>
            <h2 style={{ color: combinedProps.theme.theme.semanticColors.bodyText }}>
              {combinedProps.strings.SettingsTitle}
            </h2>
            <p style={{ color: combinedProps.theme.theme.semanticColors.bodyText }}>
              {combinedProps.strings.SettingsDescription}
            </p>
            {combinedProps.colorPickerOpenId &&
              this.renderColorPicker(
                combinedProps.colorPickerOpenId.color,
                combinedProps.colorPickerOpenId.forStyle as keyof typeof combinedProps
              )}

            <h4 style={{ color: combinedProps.theme.theme.semanticColors.bodyText }}>
              {combinedProps.strings.SettingsRunnerOutputStyles}
            </h4>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex" }}>
                <ColorPickerControl
                  forStyle="playerStoryOutputStyles"
                  textStyleObj={combinedProps.playerStoryOutputStyles}
                  update={combinedProps.dispatchOutputStyles}
                />
                <FontStyleControl
                  chosenStyle={combinedProps.playerStoryOutputStyles}
                  chosenDispatchCall={combinedProps.dispatchOutputStyles}
                />
              </div>
              <FontSizeControl
                chosenStyle={combinedProps.playerStoryOutputStyles}
                chosenDispatchCall={combinedProps.dispatchOutputStyles}
                forStyle="playerStoryOutputStyles"
              />
            </div>
            <h4 style={{ color: combinedProps.theme.theme.semanticColors.bodyText, marginTop: "4rem" }}>
              {combinedProps.strings.SettingsRunnerOptionStyles}
            </h4>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex" }}>
                <ColorPickerControl
                  forStyle="playerStoryOptionStyles"
                  textStyleObj={combinedProps.playerStoryOptionStyles}
                  update={combinedProps.dispatchOptionStyles}
                />
                <FontStyleControl
                  chosenStyle={combinedProps.playerStoryOptionStyles}
                  chosenDispatchCall={combinedProps.dispatchOptionStyles}
                />
              </div>
              <FontSizeControl
                chosenStyle={combinedProps.playerStoryOptionStyles}
                chosenDispatchCall={combinedProps.dispatchOptionStyles}
                forStyle="playerStoryOptionStyles"
              />
            </div>
            <h4 style={{ color: combinedProps.theme.theme.semanticColors.bodyText, marginTop: "4rem" }}>
              {combinedProps.strings.SettingsRunnerOptionHighlightStyles}
            </h4>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex" }}>
                <ColorPickerControl
                  forStyle="playerStoryOptionHighlightStyles"
                  textStyleObj={combinedProps.playerStoryOptionHighlightStyles}
                  update={combinedProps.dispatchOptionHighlightStyles}
                />
                <FontStyleControl
                  chosenStyle={combinedProps.playerStoryOptionHighlightStyles}
                  chosenDispatchCall={combinedProps.dispatchOptionHighlightStyles}
                />
              </div>
              <FontSizeControl
                chosenStyle={combinedProps.playerStoryOptionHighlightStyles}
                chosenDispatchCall={combinedProps.dispatchOptionHighlightStyles}
                forStyle="playerStoryOptionHighlightStyles"
              />
            </div>
            <h4 style={{ color: combinedProps.theme.theme.semanticColors.bodyText, marginTop: "4rem" }}>
              {combinedProps.strings.SettingsRunnerInputStyles}
            </h4>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex" }}>
                <ColorPickerControl
                  forStyle="playerStoryInputStyles"
                  textStyleObj={combinedProps.playerStoryInputStyles}
                  update={combinedProps.dispatchInputStyles}
                />
                <FontStyleControl
                  chosenStyle={combinedProps.playerStoryInputStyles}
                  chosenDispatchCall={combinedProps.dispatchInputStyles}
                />
              </div>
              <FontSizeControl
                chosenStyle={combinedProps.playerStoryInputStyles}
                chosenDispatchCall={combinedProps.dispatchInputStyles}
                forStyle="playerStoryInputStyles"
              />
            </div>
          </div>
          <div style={{ flexGrow: 1, marginLeft: "1rem" }}>
            <h2 style={{ color: combinedProps.theme.theme.semanticColors.bodyText }}>
              {combinedProps.strings.SettingsLivePreview}
            </h2>
            <RunnerView storyToParseOverride={combinedProps.strings.SettingsLivePreviewStory} />
          </div>
        </div>
      </>
    );
  }

  /** Renders a color picker to adjust the chosen color for a style override. */
  private renderColorPicker = (color: keyof ITextStyleColors, forStyle: keyof CombinedProps) => {
    const combinedProps = this.props as CombinedProps;
    const style = combinedProps[forStyle] as ITextStyle;
    let chosenStyle: ITextStyle;
    let chosenDispatchCall: (style: ITextStyle) => void;

    switch (forStyle) {
      case "playerStoryInputStyles": {
        chosenDispatchCall = combinedProps.dispatchInputStyles;
        chosenStyle = combinedProps.playerStoryInputStyles;
        break;
      }
      case "playerStoryOptionStyles": {
        chosenDispatchCall = combinedProps.dispatchOptionStyles;
        chosenStyle = combinedProps.playerStoryOptionStyles;
        break;
      }
      case "playerStoryOptionHighlightStyles": {
        chosenDispatchCall = combinedProps.dispatchOptionHighlightStyles;
        chosenStyle = combinedProps.playerStoryOptionHighlightStyles;
        break;
      }
      case "playerStoryOutputStyles": {
        chosenDispatchCall = combinedProps.dispatchOutputStyles;
        chosenStyle = combinedProps.playerStoryOutputStyles;
        break;
      }
      default: {
        return;
      }
    }

    const updateColor = (_: React.SyntheticEvent<HTMLElement, Event>, cssColor: IColor) => {
      chosenDispatchCall({
        ...chosenStyle,
        [color]: cssColor.str,
      });
    };

    return (
      <ColorPicker
        alphaType="none"
        color={style[color] ?? ""}
        onChange={updateColor}
        strings={{
          blue: combinedProps.strings.SettingsControlColorPickerBlue,
          green: combinedProps.strings.SettingsControlColorPickerGreen,
          hex: combinedProps.strings.SettingsControlColorPickerHex,
          hueAriaLabel: combinedProps.strings.SettingsControlColorPickerHue,
          red: combinedProps.strings.SettingsControlColorPickerRed,
          rootAriaLabelFormat: combinedProps.strings.SettingsControlColorPickerSelectedColor,
          svAriaDescription: combinedProps.strings.SettingsControlColorPickerSvDescription,
          svAriaLabel: combinedProps.strings.SettingsControlColorPickerSvAria,
          svAriaValueFormat: combinedProps.strings.SettingsControlColorPickerSelectedSv,
        }}
        styles={{ table: { color: combinedProps.theme.theme.semanticColors.bodyText } }}
      />
    );
  };
}

export const RunnerSettings = connect(mapStateToProps, mapDispatchToProps)(RunnerSettingsC);
