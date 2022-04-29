import * as React from "react";
import { hiddenAndInaccessible } from "../common/styles/controlStyles";

export type MainCommandBarProps = {
  /** Props to pass through to the container control with the click action. */
  containerProps?: Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
    "onClick"
  >;

  /** Props to pass through to the underlying input control. */
  inputProps: Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "ref" | "type"
  >;

  /**
   * The element to replace the default input control. The container receives the click that
   * invokes the file dialog. Avoid stopping propagation.
   */
  uploadElement: React.ReactNode;
};

/**
 * Current browser implementation requires invoking a click on an input control of type 'file' to
 * open a file dialog for the user. This renders a hidden input control and calls its click action
 * when the user clicks a <span> containing a user-provided control.
 */
export class UploadFile extends React.Component<MainCommandBarProps> {
  private inputRef = React.createRef<HTMLInputElement>();

  public render() {
    return (
      <>
        <input
          {...this.props.inputProps}
          className={`${this.props.inputProps.className} ${hiddenAndInaccessible}`}
          ref={this.inputRef}
          type="file"
        />
        <span {...this.props.containerProps} onClick={this.onClick}>
          {this.props.uploadElement}
        </span>
      </>
    );
  }

  /** Calls the click event of the underlying input element. */
  private onClick = () => {
    this.inputRef.current?.click();
  };
}
