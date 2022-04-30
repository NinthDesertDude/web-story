import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { dispatchAddError } from "../../common/errors/topLevelErrors.reducers";
import { StoryInterpreterC, StoryInterpreter } from "../../parse-story/storyInterpreter";
import { parseStory } from "../../parse-story/storyParser";
import { IRootState } from "../../store";

const mapStateToProps = (state: IRootState) => {
  return {
    renderTrigger: state.viewEdit.storyReparseToken, // Needed to re-render without story changing.
    storyToParse: state.viewEdit.storyToParse,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    dispatchAddError: dispatchAddError(dispatch),
  };
};

type RunnerViewOwnProps = {
  /**
   * If provided, parses this story instead of the current one, for e.g. live previews in the UI that won't conflict
   * with the current one being read/written.
   */
  storyToParseOverride?: string;
};

type CombinedProps = RunnerViewOwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class RunnerViewC extends React.Component<RunnerViewOwnProps> {
  private interpreterRef: StoryInterpreterC | null = null;

  public componentDidUpdate() {
    this.parse();
  }

  public render() {
    return <StoryInterpreter debugging={true} ref={this.setInterpreterRef} />;
  }

  private setInterpreterRef = (ref: StoryInterpreterC | null) => {
    if (ref !== null) {
      this.interpreterRef = ref;
      this.parse();
    }
  };

  /** Parses the story with the given interpreter. */
  private parse() {
    if (this.interpreterRef === null) {
      return;
    }

    try {
      parseStory(this.props.storyToParseOverride ?? (this.props as CombinedProps).storyToParse, this.interpreterRef);
    } catch (ex) {
      if (typeof ex === "string") {
        (this.props as CombinedProps).dispatchAddError("unexpected error while parsing: " + ex);
      } else if (ex instanceof Error) {
        (this.props as CombinedProps).dispatchAddError("unexpected error while parsing: " + ex.message);
      } else if (ex instanceof Object) {
        (this.props as CombinedProps).dispatchAddError("unexpected error while parsing: " + ex.toString());
      }
    }
  }
}

export const RunnerView = connect(mapStateToProps, mapDispatchToProps)(RunnerViewC);
