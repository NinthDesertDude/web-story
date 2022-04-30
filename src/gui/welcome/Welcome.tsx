import { DefaultButton } from "@fluentui/react";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { commandIds, invokeCommand } from "../../common/commands/CommandHandler";
import { routes } from "../../common/routing/Routing";
import { welcomeButtonStyle } from "../../common/styles/controlStyles";
import { IRootState } from "../../store";
import { getStrings } from "../../common/localization/Localization";

const mapStateToProps = (state: IRootState) => {
  return {
    strings: getStrings(state.settings.locale),
    theme: state.settings.theme,
  };
};

type WelcomeOwnProps = {};
type CombinedProps = WelcomeOwnProps & RouteComponentProps & ReturnType<typeof mapStateToProps>;

export class WelcomeC extends React.Component<CombinedProps> {
  public render() {
    const combinedProps = this.props as CombinedProps;
    const buttonStyle = welcomeButtonStyle(combinedProps.theme.theme);

    return (
      <>
        <div
          style={{
            alignContent: "center",
            display: "flex",
            flexDirection: "column",
            height: "90vh",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DefaultButton onClick={this.onClickPlayProject} styles={buttonStyle}>
              {combinedProps.strings.WelcomeButtonOpenPlay}
            </DefaultButton>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DefaultButton onClick={this.onClickEditProject} styles={buttonStyle}>
              {combinedProps.strings.WelcomeButtonOpenEdit}
            </DefaultButton>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DefaultButton onClick={this.onClickNew} styles={buttonStyle}>
              {combinedProps.strings.WelcomeButtonNew}
            </DefaultButton>
          </div>
        </div>
      </>
    );
  }

  private onClickPlayProject = () => {
    invokeCommand(commandIds.openProjectOrGame, {
      data: {
        data: () => {
          this.props.history.push(routes.play);
        },
      },
    });
  };

  private onClickEditProject = () => {
    invokeCommand(commandIds.openProjectOrGame, {
      data: {
        data: () => {
          this.props.history.push(routes.edit);
        },
      },
    });
  };

  private onClickNew = () => {
    invokeCommand(commandIds.newProject, { data: this.props.history });
    this.props.history.push(routes.edit);
  };
}

export const Welcome = connect(mapStateToProps)(withRouter(WelcomeC));
