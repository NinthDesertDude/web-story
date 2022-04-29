import * as React from "react";
import { connect } from "react-redux";
import { commandBarDropdownStyle } from "../../common/styles/controlStyles";
import { IDropdownProps, IDropdownStyles } from "@fluentui/react/lib/components/Dropdown/Dropdown.types";
import { Dropdown } from "@fluentui/react/lib/components/Dropdown/Dropdown";
import { IRootState } from "../../store";

const mapStateToProps = (state: IRootState) => {
  return {
    theme: state.settings.theme,
  };
};

/** Main props associated with the MenuBarDropdown. */
export interface CommandBarDropdownProps {
  dropdown: IDropdownProps;
}

type CombinedProps = ReturnType<typeof mapStateToProps> & CommandBarDropdownProps;

/** Renders a theme-connected dropdown styled for inclusion in the main command bar. */
class CommandBarDropdownC extends React.Component<CommandBarDropdownProps> {
  public render() {
    const { styles, ...props } = (this.props as CombinedProps).dropdown;
    const stylesTyped = styles as IDropdownStyles;

    return (
      <Dropdown
        {...props}
        dropdownWidth="auto"
        styles={commandBarDropdownStyle((this.props as CombinedProps).theme.theme, stylesTyped)}
      />
    );
  }
}

export const CommandBarDropdown = connect(mapStateToProps)(CommandBarDropdownC);
