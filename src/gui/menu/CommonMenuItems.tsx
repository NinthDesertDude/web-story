import * as React from "react";
import { getTheme } from "@fluentui/react/lib/Styling";
import { ICommandBarItemProps } from "@fluentui/react/lib/components/CommandBar/CommandBar.types";
import { IDropdownOption } from "@fluentui/react/lib/components/Dropdown/Dropdown.types";
import { Icon } from "@fluentui/react/lib/components/Icon/Icon";
import { getStrings } from "../../common/localization/Localization";
import { localizedStrings } from "../../common/localization/LocalizedStrings";
import { dispatchSetLocale, dispatchSetTheme } from "../../common/settings/settings.reducers";
import {
  iconSpaceBeforeTextStyle,
  commandBarDropdownSeparatorStyle,
  commandBarDropdownButtonStyle,
} from "../../common/styles/controlStyles";
import { themes, ISupportedTheme } from "../../common/themes";
import { IRootState } from "../../store";
import { CommandBarDropdown } from "./MenuBarDropdown";

interface IValues {
  locale: IRootState["settings"]["locale"];
  reduxState: IRootState;
  strings: ReturnType<typeof getStrings>;
  themeName: IRootState["settings"]["theme"]["localizedName"];
  userConsentProvided: IRootState["persistence"]["userConsentProvided"];
  wholeTheme: ReturnType<typeof getTheme>;
  setLocale: ReturnType<typeof dispatchSetLocale>;
  setTheme: ReturnType<typeof dispatchSetTheme>;
}

/** Returns command bar items that should be globally available. */
export const getCommonCommandItems = (values: IValues): ICommandBarItemProps[] => {
  /** Renders the dropdown for the locale picker control. */
  const renderLocaleDropdown = () => {
    const options: IDropdownOption[] = [];

    // Populates the available locales.
    Object.keys(localizedStrings).forEach((localeOption: string) => {
      options.push({
        data: localeOption,
        key: getLocaleDropdownOptionKey(localeOption),
        text: localizedStrings[localeOption as keyof typeof localizedStrings].LanguageCodeName,
      });
    });

    /** Switches all GUI to display in the user-chosen language. */
    const updateChangedLocale = (_: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
      if (option !== undefined) {
        const localeId = option.data as keyof typeof localizedStrings;
        values.setLocale(localeId);
      }
    };

    /** Renders the locale dropdown and name of the currently-chosen language. */
    const renderDropdownTitle = () => (
      <>
        <Icon iconName="LocaleLanguage" styles={iconSpaceBeforeTextStyle} />
        <span style={{ fontSize: `${values.wholeTheme.fonts.large}` }}>
          {localizedStrings[values.locale].LanguageCodeName}
        </span>
      </>
    );

    return (
      <CommandBarDropdown
        dropdown={{
          defaultSelectedKey: getLocaleDropdownOptionKey(values.locale),
          onRenderTitle: renderDropdownTitle,
          options: options,
          onChange: updateChangedLocale,
        }}
      />
    );
  };

  /** Renders the dropdown for the theme picker control. */
  const renderThemeDropdown = () => {
    const options: IDropdownOption[] = [];

    // Populates the available themes.
    Object.keys(themes).forEach((themeKey: string) => {
      const theme = themes[themeKey as unknown as keyof typeof themes];

      options.push({
        data: theme,
        key: getThemeDropdownOptionKey(theme.localizedName),
        text: theme.localizedName,
      });
    });

    /** Switches all GUI to display with the chosen theme. */
    const updateChangedTheme = (_: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
      if (option !== undefined) {
        const theme = option.data as ISupportedTheme;
        values.setTheme(theme);
      }
    };

    /** Renders the theme dropdown and name of the currently-chosen theme. */
    const renderDropdownTitle = () => (
      <span style={{ fontSize: `${values.wholeTheme.fonts.large}` }}>
        {values.strings.ThemeDropdownText(values.themeName)}
      </span>
    );

    return (
      <CommandBarDropdown
        dropdown={{
          defaultSelectedKey: getThemeDropdownOptionKey(values.themeName),
          onRenderTitle: renderDropdownTitle,
          options: options,
          onChange: updateChangedTheme,
          styles: commandBarDropdownSeparatorStyle(values.wholeTheme),
        }}
      />
    );
  };

  // Theme and language options.
  return [
    {
      ariaLabel: values.strings.TipTheme,
      key: "userSettingsCommandBarChosenTheme",
      onRender: renderThemeDropdown,
      buttonStyles: commandBarDropdownButtonStyle(),
    },
    {
      ariaLabel: values.strings.TipLanguage,
      key: "userSettingsCommandBarChosenLocale",
      onRender: renderLocaleDropdown,
    },
  ];
};

/** Generates a key for options in the locale dropdown menu. */
function getLocaleDropdownOptionKey(localeId: string) {
  return `userSettingsLocaleOptions${localeId}`;
}

/** Generates a key for options in the theme dropdown menu. */
function getThemeDropdownOptionKey(themeName: string) {
  return `userSettingsThemeOptions${themeName}`;
}
