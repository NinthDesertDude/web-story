import { getStrings } from "../../common/localization/Localization";
import { commandBarItemStyle } from "../../common/styles/controlStyles";
import { getTheme } from "@fluentui/react/lib/Styling";
import { ICommandBarItemProps } from "@fluentui/react/lib/components/CommandBar/CommandBar.types";
import { RouteComponentProps } from "react-router-dom";
import { routes } from "../../common/routing/Routing";

interface IValues {
  history: RouteComponentProps["history"];
  strings: ReturnType<typeof getStrings>;
  wholeTheme: ReturnType<typeof getTheme>;
}

/** Returns command bar items associated with the runner settings page. */
export const getRunnerSettingsCommandItems = (values: IValues) => {
  const items: ICommandBarItemProps[] = [
    {
      className: commandBarItemStyle(values.wholeTheme, true),
      key: "userSettingsCommandBarMenuBack",
      name: values.strings.MenuBack,
      iconProps: { iconName: "Back" },
      onClick: () => {
        values.history.push(routes.play);
      },
    },
  ];

  return { items };
};
