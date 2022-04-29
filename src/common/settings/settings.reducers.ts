import { combineReducers, Dispatch } from "redux";
import { getSupportedLocale, ILocalizedStringSets, supportedLocales } from "../localization/Localization";
import { ISupportedTheme, Themes, themes } from "../themes";
import { actions, setLocale, setTheme } from "./settings.actions";
import { loadTheme } from "@fluentui/react/lib/Styling";
import * as persistence from "../storage/persistence.actions";
import { IAction } from "../redux/reduxTools";

/** The user's preferred theme. An empty string here should mean the default theme is applied. */
const theme = (state: ISupportedTheme = themes[Themes.Default], action: IAction) => {
  if (action.type === actions.setTheme) {
    const typedAction = action as ReturnType<typeof setTheme>;

    if (state.theme !== typedAction.theme.theme) {
      document.body.style.backgroundColor = typedAction.theme.theme.semanticColors.bodyBackground;
      loadTheme(typedAction.theme.theme);
      return typedAction.theme;
    }
  } else if (action.type === persistence.actions.setFromLocalStorage) {
    const typedAction = action as ReturnType<typeof persistence.setFromLocalStorage>;

    if (typedAction?.persistentState?.theme ?? false) {
      try {
        const typedTheme = typedAction.persistentState.theme as keyof typeof themes;

        if (typeof typedAction.persistentState.theme === "number") {
          const theme = themes[typedTheme];

          if (theme) {
            document.body.style.backgroundColor = theme.theme.semanticColors.bodyBackground;
            loadTheme(theme.theme);
            return theme;
          }
        }
      } catch {
        // Ignore
      }
    }
  }

  return state;
};

/** Sets the full theme based on a partial theme and injects it to update components. */
export const dispatchSetTheme = (dispatch: Dispatch) => async (supportedTheme: ISupportedTheme) => {
  dispatch(setTheme(supportedTheme));
};

/** The user's preferred language. */
const locale = (state = getSupportedLocale(), action: IAction) => {
  if (action.type === actions.setLocale) {
    const typedAction = action as ReturnType<typeof setLocale>;
    return typedAction.localeId;
  }

  if (action.type === persistence.actions.setFromLocalStorage) {
    const typedAction = action as ReturnType<typeof persistence.setFromLocalStorage>;

    // Don't load with invalid or unsupported locales.
    if (typedAction?.persistentState?.locale ?? false) {
      const locales = Object.keys(supportedLocales) as (keyof typeof supportedLocales)[];

      for (let i = 0; i < locales.length; i++) {
        const locale = supportedLocales[locales[i]];
        if (typedAction.persistentState.locale === locale) {
          return typedAction.persistentState.locale;
        }
      }

      return state;
    }
  }

  return state;
};

/** Sets the locale id in lowercase, such as en-us. */
export const dispatchSetLocale = (dispatch: Dispatch) => async (localeId: keyof ILocalizedStringSets) => {
  dispatch(setLocale(localeId));
};

// Combine reducers and typescript definition.
export interface ISettingState {
  locale: keyof ILocalizedStringSets;
  theme: ISupportedTheme;
}

export const settings = combineReducers({
  locale,
  theme,
});
