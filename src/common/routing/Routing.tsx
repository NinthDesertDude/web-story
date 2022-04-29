import * as React from "react";
import { Route, Switch } from "react-router";
import { Welcome } from "../../gui/welcome/Welcome";
import { RunnerEditorView } from "../../gui/runner-editor/RunnerEditorView";
import { getStrings } from "../localization/Localization";
import { getTheme } from "@fluentui/react/lib/Styling";
import { Dispatch } from "redux";
import { IRootState } from "../../store";
import { connect } from "react-redux";
import { OpenFileHandler } from "../../gui/OpenFileHandler";
import { RunnerView } from "../../gui/runner/RunnerView";
import { MenuBar } from "../../gui/menu/MenuBar";
import { RunnerSettings } from "../../gui/runner-settings-page/RunnerSettings";
import { EditorSettings } from "../../gui/editor-settings-page/EditorSettings";
import { loadFromLocalStorage, LocalStorageSaveHandler } from "../storage/LocalStorageSaveHandler";
import { CommandHandler } from "../commands/CommandHandler";
import { dispatchSetFromLocalStorage } from "../storage/persistence.reducers";

export const routes = {
  base: "/",

  /** Navigates to the runner (player view). */
  play: "/play",

  /** Navigates to the runner settings. */
  playSettings: "/play/settings",

  /** Navigates to the editor (author view). */
  edit: "/edit",

  editSettings: "/edit/settings",
};

const mapStateToProps = (state: IRootState) => {
  return {
    locale: state.settings.locale,
    strings: getStrings(state.settings.locale),
    themeName: state.settings.theme.localizedName,
    userConsentProvided: state.persistence.userConsentProvided,
    wholeTheme: getTheme(),
  };
};

/** Returns true when the user is on the named route. */
export function isOnPage(route: keyof typeof routes) {
  return routes[route] === window.location.hash.replace(/\?.*/g, "").substring(1).toLowerCase();
}

/** Returns true when the user is playing a game in play mode or one of its subpages. */
export function isPlayMode() {
  return window.location.hash.substring(1).toLowerCase().startsWith(routes["play"]);
}

/** Returns true when the user is authoring a game in edit mode or one of its subpages. */
export function isEditMode() {
  return window.location.hash.substring(1).toLowerCase().startsWith(routes["edit"]);
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setFromLocalStorage: dispatchSetFromLocalStorage(dispatch),
  };
};

type RoutingOwnProps = {};
type CombinedProps = RoutingOwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class RoutingC extends React.Component<RoutingOwnProps> {
  /** Applies all user setting stored in local storage if allowed. */
  public componentDidMount() {
    const combinedProps = this.props as CombinedProps;

    if (combinedProps.userConsentProvided) {
      loadFromLocalStorage(combinedProps.setFromLocalStorage);
    }
  }

  public render() {
    return (
      <>
        <OpenFileHandler />
        <LocalStorageSaveHandler />
        <CommandHandler />
        <MenuBar />
        <Switch>
          <Route path={routes.base} exact={true} component={Welcome} />
          <Route path={routes.edit} exact={true} component={RunnerEditorView} />
          <Route path={routes.editSettings} component={EditorSettings} />
          <Route path={routes.play} exact={true} component={RunnerView} />
          <Route path={routes.playSettings} component={RunnerSettings} />
        </Switch>
      </>
    );
  }
}

export const Routing = connect(mapStateToProps, mapDispatchToProps)(RoutingC);
