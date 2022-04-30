import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store";
import { getStrings } from "../localization/Localization";
import { dispatchClearErrors } from "./topLevelErrors.reducers";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/components/MessageBar";
import { Dialog } from "@fluentui/react/lib/components/Dialog/Dialog";
import { FontIcon } from "@fluentui/react/lib/components/Icon/FontIcon";
import { dialogErrorIconStyle } from "../styles/controlStyles";

const mapStateToProps = (state: IRootState) => {
  return {
    errors: state.topLevelErrors.errorMessages,
    strings: getStrings(state.settings.locale),
    theme: state.settings.theme,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    clearErrors: dispatchClearErrors(dispatch),
  };
};

export type TopLevelErrorsOwnProps = {};

type CombinedProps = TopLevelErrorsOwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class TopLevelErrorsC extends React.Component<TopLevelErrorsOwnProps> {
  private errorMessagesGUID = 0;

  public render() {
    const combinedProps = this.props as CombinedProps;
    const elementsToRender: JSX.Element[] = [];

    // Shows a modal dialog for users on browsers that don't support IndexedDB, the global loading/saving mechanism.
    if (!window.indexedDB) {
      elementsToRender.push(
        <Dialog
          hidden={false}
          dialogContentProps={{
            title: combinedProps.strings.ErrorTitleGenericFatal,
            showCloseButton: false,
          }}
          modalProps={{ isBlocking: true }}
        >
          <FontIcon className={dialogErrorIconStyle(combinedProps.theme.theme)} iconName="StatusErrorFull" />
          {combinedProps.strings.ErrorNoIndexedDBSupport}
        </Dialog>
      );
    }

    // Shows top level errors e.g. unexpected caught errors, problems loading a file, etc.
    let errorMessages: JSX.Element[] = [];
    if (combinedProps.errors.length !== 0) {
      for (let i = 0; i < combinedProps.errors.length; i++) {
        errorMessages.push(
          <div key={`toplevel-error-message-${this.errorMessagesGUID}`}>{combinedProps.errors[i]}</div>
        );
        this.errorMessagesGUID++;
      }

      elementsToRender.push(<MessageBar messageBarType={MessageBarType.error}>{errorMessages}</MessageBar>);
    }

    return elementsToRender;
  }
}

export const TopLevelErrors = connect(mapStateToProps, mapDispatchToProps)(TopLevelErrorsC);
