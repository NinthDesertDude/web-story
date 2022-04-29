import { ILocalizedStringSets } from "./Localization";

// tslint:disable:max-line-length It's actually more legible to keep strings on one line here.

/** All strings localized in all locales. */
export const localizedStrings: ILocalizedStringSets = {
  "en-us": {
    ApplicationName: "Web Story",
    ApplicationNameAndVersion: (appName: string, appVersion: string) => `${appName} version ${appVersion}`,
    EditorPlay: "Play",
    LanguageCodeName: "English (United States)",
    MenuBack: "Back",
    MenuFile: "File",
    MenuPrefEditorSettings: "Settings and preferences for the game",
    MenuFileNew: "New",
    MenuFileOpen: "Open",
    MenuPrefRunnerSettings: "Settings and preferences for your experience",
    MenuFileSave: "Save",
    MenuFileSwitchToEdit: "Switch to edit mode",
    MenuFileSwitchToPlay: "Switch to play mode",
    RunnerRestart: "Restart",
    SettingsControlColorPickerBlue: "blue",
    SettingsControlColorPickerGreen: "green",
    SettingsControlColorPickerHex: "hex",
    SettingsControlColorPickerHue: "hue",
    SettingsControlColorPickerRed: "red",
    SettingsControlColorPickerSelectedColor: "Color picker, {0} selected.",
    SettingsControlColorPickerSelectedSv: "Saturation {0} brightness {1}",
    SettingsControlColorPickerSvAria: "saturation and brightness",
    SettingsControlColorPickerSvDescription:
      "Use left and right arrow keys to set saturation. Use up and down arrow keys to set brightness.",
    SettingsControlFontSizeSpinButtonAria: "Adjust font size",
    SettingsControlFontSizeSpinButtonDecrAria: "decrease font size by 1",
    SettingsControlFontSizeSpinButtonIncrAria: "increase font size by 1",
    SettingsControlFontSizeSpinButtonLabel: "font size",
    SettingsControlFontSizeSpinButtonUnset: "unset",
    SettingsControlFontSizeDropdownLabel: "font size unit",
    SettingsControlFontSizeDropdownRemsLabel: "rems",
    SettingsControlFontSizeDropdownRemsTitle:
      "rems are a 'relative' measurement that takes screen density into account. Use this one normally.",
    SettingsControlFontSizeDropdownPixelsLabel: "pixels",
    SettingsControlFontSizeDropdownPixelsTitle:
      "Pixels (px) is an 'absolute' measurement that doesn't take screen density into account, so a font may display at different sizes on different devices.",
    SettingsControlFontStyleSliderOff: "always off",
    SettingsControlFontStyleSliderOn: "always on",
    SettingsControlFontStyleSliderUnset: "unset",
    SettingsControlFontStyleBold: "bold",
    SettingsControlFontStyleItalic: "italic",
    SettingsControlFontStyleStrikethrough: "strikethrough",
    SettingsControlFontStyleUnderline: "underline",
    SettingsDescription:
      "The values you set here will override the styles set by authors for their own games. Use this to customize your playing experience. Values set are reflected in the demo on the right-hand side.",
    SettingsLivePreview: "Live Preview",
    SettingsLivePreviewStory:
      "@1\n{normal text\n}{italic text\n*}{bold text\n**}{bold italic text\n***}\noption @2\n@2\n{normal text}\nback @1",
    SettingsRunnerInputStyles: "Override text styles of logs",
    SettingsRunnerOptionStyles: "Override text styles of options",
    SettingsRunnerOptionHighlightStyles: "Override text styles of options the mouse hovers over",
    SettingsRunnerOutputStyles: "Override preferences for text the game prints out",
    SettingsTextStyleColorUnset: "unset",
    SettingsTextStyleDarkColor: "Dark theme color",
    SettingsTextStyleHighlightDarkColor: "Highlight dark theme color",
    SettingsTextStyleHighlightLightColor: "Highlight light theme color",
    SettingsTextStyleLightColor: "Light theme color",
    SettingsTitle: "Text Style Overrides",
    ThemeContrastDark: "🌑 Contrast Dark",
    ThemeContrastLight: "☀️ Contrast Light",
    ThemeDefault: "☀️ Default",
    ThemeDeepSea: "🌑 Deep Sea",
    ThemeDim: "🌑 Dim",
    ThemeEarthAndSky: "☀️ Earth and Sky",
    ThemeMidnight: "🌑 Midnight",
    ThemeMuted: "☀️ Muted",
    ThemeSlate: "🌑 Slate",
    ThemeDropdownText: (themeName: string) => `${themeName} theme`,
    TipLanguage: "Language",
    TipNavigateCommandBar: "Use left and right arrow keys to navigate between commands.",
    TipTheme: "Theme",
    WelcomeButtonOpenPlay: "Open & Play",
    WelcomeButtonOpenEdit: "Open & Edit",
    WelcomeButtonNew: "New",
  },
};