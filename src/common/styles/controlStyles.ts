import { IButtonStyles } from "@fluentui/react/lib/components/Button/Button.types";
import { IStyle, ITheme, mergeStyles } from "@fluentui/react/lib/Styling";
import { IDropdownStyles } from "@fluentui/react/lib/components/Dropdown/Dropdown.types";
import { ICommandBarStyles } from "@fluentui/react/lib/components/CommandBar/CommandBar.types";
import { IIconStyles } from "@fluentui/react/lib/components/Icon/Icon.types";

/**
 * Returns a style for a dropdown in the command bar. If there are items to the right, renders a
 * thin border between.
 */
export const commandBarDropdownButtonStyle = (): IButtonStyles => {
  return { root: { alignSelf: "stretch" } };
};

/**
 * Returns a style for a command bar dropdown that renders a border to the right of the item.
 */
export const commandBarDropdownSeparatorStyle = (theme: ITheme): Partial<IDropdownStyles> => {
  return {
    root: {
      borderColor: theme.semanticColors.menuDivider,
      borderRightStyle: "solid",
      borderWidth: "1px",
    },
  };
};

/** Returns a style for a dropdown in the command bar. */
export const commandBarDropdownStyle = (theme: ITheme, propStyles: IDropdownStyles): Partial<IDropdownStyles> => {
  return {
    caretDownWrapper: mergeStyles(
      { alignSelf: "center", position: "relative", right: "20px", width: "0px" },
      propStyles?.caretDownWrapper
    ),
    dropdown: mergeStyles(
      {
        display: "flex",
        height: "100%",
      },
      propStyles?.dropdown
    ),
    dropdownItem: mergeStyles({ ...theme.fonts.large }, propStyles?.dropdownItem),
    dropdownItemSelected: mergeStyles({ ...theme.fonts.large }, propStyles?.dropdownItemSelected),
    root: mergeStyles({ alignSelf: "stretch" }, propStyles?.root),
    title: mergeStyles(
      {
        height: "100%",
        border: "0",
        borderRadius: "unset",
        display: "flex",
        alignItems: "center",
      },
      propStyles?.title
    ),
  };
};

/**
 * Returns a style for a command bar item definition that increase button space. If there are
 * items to the right, renders a thin border between.
 */
export const commandBarItemStyle = (theme: ITheme, itemsOnRight?: boolean): string => {
  if (itemsOnRight) {
    return mergeStyles(theme.fonts.large, {
      paddingLeft: "12px",
      paddingRight: "12px",
      borderColor: theme.semanticColors.menuDivider,
      borderRightStyle: "solid",
      borderWidth: "1px",
    });
  }

  return mergeStyles(theme.fonts.large, {
    paddingLeft: "12px",
    paddingRight: "12px",
  });
};

/**
 * Returns a style for a command bar that tries to maximize the size of the items within it, for a
 * simplified appearance that is more mobile-friendly than the default style. Items within the
 * command bar should be styled to fill the command bar vertically, and take enough space to be
 * easy to interact with.
 */
export const commandBarStyle: ICommandBarStyles = {
  root: {
    alignItems: "center",
    height: "4vh",
    padding: "0px",
  },
  primarySet: {
    alignSelf: "stretch",
  },
  secondarySet: {
    alignSelf: "stretch",
  },
};

/** Returns a style for the editor text area component. */
export const editorTextAreaStyle = (theme: ITheme): React.CSSProperties => {
  return {
    backgroundColor: theme.semanticColors.bodyStandoutBackground,
    borderStyle: "solid",
    borderWidth: "1px",
    boxSizing: "border-box",
    color: theme.semanticColors.bodyText,
    height: "90vh",
    padding: "0.25vh 0.25vw 0.25vh 0.25vw",
    resize: "none",
    width: "100%",
  };
};

/** Fonts to use in case other fonts are not available. */
export const fallbackFontStack = "Calibri, Times New Roman, Courier New, sans-serif";

/** Display none. */
export const hiddenAndInaccessible = mergeStyles({
  display: "none",
});

/** Separates an icon from text that follows it.  */
export const iconSpaceBeforeTextStyle: IIconStyles = {
  root: {
    marginRight: "8px",
  },
};

/** Sets up the div containing the editor textarea. */
export const mainViewEditorStyle = mergeStyles({
  boxSizing: "border-box",
  height: "90vh",
  margin: "0 0.25vw 0 0",
  width: "49.75vw",
});

/** Styles the runner to give it a border and make overflowing generated content scroll. */
export const mainViewRunnerStyle = (theme: ITheme): IStyle => {
  return {
    borderColor: theme.semanticColors.menuDivider,
    borderStyle: "solid",
    borderWidth: "1px",
    boxSizing: "border-box",
    height: "90vh",
    margin: "0 0 0 0.25vw",
    width: "49.75vw",
  };
};

/** Sets up the div containing the editor and runner so they stretch horizontally to full size. */
export const mainViewWrapperStyle = mergeStyles({ display: "flex", alignItems: "stretch", margin: "4px" });

/** Styles the innermost div that contains all generated content in the runner. */
export const runnerOutputWrapperStyle = mergeStyles({
  flexGrow: 1,
  overflowY: "auto",
  paddingLeft: "0.5vw",
  paddingRight: "0.5vw",
  paddingTop: "0.5vw",
});

/** Styles the div containing all controls associated to the runner so they display properly. */
export const runnerWrapperStyle = mergeStyles({ display: "flex", flexDirection: "column", height: "90vh" });

/** Styles a main button on the welcome page. */
export const welcomeButtonStyle = (theme: ITheme): IButtonStyles => {
  return {
    root: [
      theme.fonts.large,
      {
        margin: "2rem",
        padding: "2rem",
      },
    ],
  };
};
