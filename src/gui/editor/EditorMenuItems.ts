import { getStrings } from "../../common/localization/Localization";
import { commandBarItemStyle } from "../../common/styles/controlStyles";
import { getTheme } from "@fluentui/react/lib/Styling";
import { ICommandBarItemProps } from "@fluentui/react/lib/components/CommandBar/CommandBar.types";
import { RouteComponentProps } from "react-router-dom";
import { commandIds, invokeCommand } from "../../common/commands/CommandHandler";
import { routes } from "../../common/routing/Routing";

interface IValues {
  history: RouteComponentProps["history"];
  strings: ReturnType<typeof getStrings>;
  wholeTheme: ReturnType<typeof getTheme>;
}

/** Returns command bar items associated with the editor. */
export const getEditorCommandItems = (values: IValues) => {
  const items: ICommandBarItemProps[] = [
    {
      className: commandBarItemStyle(values.wholeTheme, true),
      data: commandIds.newProject,
      key: "userSettingsCommandBarFileMenuNew",
      name: values.strings.MenuFileNew,
      iconProps: { iconName: "FabricNewFolder" },
      onClick: () => invokeCommand(commandIds.newProject),
    },
    {
      className: commandBarItemStyle(values.wholeTheme, true),
      data: commandIds.openProjectOrGame,
      key: "userSettingsCommandBarFileMenuOpen",
      name: values.strings.MenuFileOpen,
      iconProps: { iconName: "OpenFolderHorizontal" },
      onClick: () => invokeCommand(commandIds.openProjectOrGame),
    },
    {
      className: commandBarItemStyle(values.wholeTheme),
      data: commandIds.saveProjectOrGame,
      key: "userSettingsCommandBarFileMenuSave",
      name: values.strings.MenuFileSave,
      iconProps: { iconName: "Save" },
      onClick: () => invokeCommand(commandIds.saveProjectOrGame),
    },
    {
      className: commandBarItemStyle(values.wholeTheme),
      key: "userSettingsCommandBarPrefMenuSettings",
      name: values.strings.MenuFileSave,
      iconOnly: true,
      iconProps: { iconName: "Settings" },
      onClick: () => {
        values.history.push(routes.editSettings);
      },
      tooltipHostProps: { content: values.strings.MenuPrefEditorSettings },
    },
  ];

  const farItems: ICommandBarItemProps[] = [
    {
      ariaLabel: values.strings.MenuFileSwitchToPlay,
      className: commandBarItemStyle(values.wholeTheme),
      data: commandIds.switchMode,
      key: "userSettingsCommandBarFileMenuSwitchMode",
      tooltipHostProps: { content: values.strings.MenuFileSwitchToPlay },
      iconOnly: true,
      iconProps: { iconName: "Switch" },
      onClick: () => invokeCommand(commandIds.switchMode),
    },
  ];

  return { items, farItems };
};
