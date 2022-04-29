import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IRootState } from "../../store";
import { ITextStyle } from "../redux/typedefs";
import { IPersistentState } from "./persistence.actions";
import { dispatchSetFromLocalStorage } from "./persistence.reducers";

const persistStateVersion = 1;
const persistStateIdentifier = "WebStory";

/** The state variables that, when changed, trigger an attempt to save to local storage. */
interface ISaveToLocalStorageProps {
  locale: IRootState["settings"]["locale"];
  playerStorySettings: IRootState["playerStorySettings"];
  theme: IRootState["settings"]["theme"];
  userConsentProvided: IRootState["persistence"]["userConsentProvided"];
}

/** Validates that a value loaded from localstorage representing font size is in an accepted format. */
function validateLoadedFontSize(str: string | undefined): boolean {
  if (str === undefined) {
    return false;
  }

  str = str.replaceAll(" ", "").toLowerCase();

  // Matches units of em, rem, px, % or no units (implied as px) for numbers like 4, 4.4, 0.4.
  if (str.match(/^\d+(px)?$/g) || str.match(/^((\d+(\.\d+)?)|((\d+|0)\.\d+))(em|rem|%)$/g)) {
    str = str.replaceAll(/em|rem|px|%/g, "");
    const num = Number(str);

    // Must be positive and restricts to a maximum of 1000.
    if (num && num > 0 && num <= 1000) {
      return true;
    }
  }

  return false;
}

/** Returns a copy of text styles loaded from localstorage, with any invalid values set as undefined. */
export function cleanLoadedTextStyle(obj: ITextStyle): ITextStyle {
  return {
    colorDark: obj.colorDark,
    colorHighlightDark: obj.colorHighlightDark,
    colorHighlightLight: obj.colorHighlightLight,
    colorLight: obj.colorLight,
    font: obj.font,
    fontSize: validateLoadedFontSize(obj.fontSize) ? obj.fontSize : undefined,
    styleBold: obj.styleBold,
    styleItalic: obj.styleItalic,
    styleStrikethrough: obj.styleStrikethrough,
    styleUnderline: obj.styleUnderline,
  };
}

/**
 * Saves the given state to local storage. Users must accept the storage policy for data that
 * isn't essential to the service or anything that helps identify an individual.
 * @throws DOMException if an error occurred with saving the data, e.g. not allowed or not enough space.
 */
const saveToLocalStorage = (state: ISaveToLocalStorageProps) => {
  if (!state.userConsentProvided) {
    return;
  }

  const newState: IPersistentState = {
    locale: state.locale,
    playerStorySettings: state.playerStorySettings,
    saveFormatVersion: persistStateVersion,
    theme: state.theme.themeId,
  };

  localStorage.setItem(persistStateIdentifier, JSON.stringify(newState));
};

/**
 * Loads the given state from local storage. Users must have accepted the storage policy for data
 * that isn't essential to the service or anything that helps identify an individual. Returns null
 * if a key isn't found. The state returned on success contains all keys, though their values
 * aren't checked for accuracy.
 */
export const loadFromLocalStorage = (applyStorage: ReturnType<typeof dispatchSetFromLocalStorage>) => {
  const loadedState = localStorage.getItem(persistStateIdentifier);

  if (loadedState !== null) {
    try {
      applyStorage(JSON.parse(loadedState) as Partial<IPersistentState>);
    } catch {
      return;
    }
  }
};

const mapStateToProps = (state: IRootState): ISaveToLocalStorageProps => {
  return {
    locale: state.settings.locale,
    playerStorySettings: state.playerStorySettings,
    theme: state.settings.theme,
    userConsentProvided: state.persistence.userConsentProvided,
  };
};

type LocalStorageSaveHandlerOwnProps = {};
type LocalStorageSaveHandlerPropsWithRouteInfo = LocalStorageSaveHandlerOwnProps & RouteComponentProps;
type CombinedProps = LocalStorageSaveHandlerPropsWithRouteInfo & ReturnType<typeof mapStateToProps>;

export class LocalStorageSaveHandlerC extends React.Component<LocalStorageSaveHandlerPropsWithRouteInfo> {
  public componentDidUpdate(prevProps: CombinedProps) {
    const props = this.props as CombinedProps;

    /**
     * Any change of value connected to this component should trigger a save to local storage if allowed, except
     * userConsentProvided.
     */
    if (prevProps.userConsentProvided === props.userConsentProvided) {
      saveToLocalStorage(this.props as CombinedProps);
    }
  }

  public render() {
    return <></>;
  }
}

/** Hooks up actions, some of which require current state or history, to commands. */
export const LocalStorageSaveHandler = connect(mapStateToProps)(withRouter(LocalStorageSaveHandlerC));
