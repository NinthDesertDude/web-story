import * as React from "react";
import { connect } from "react-redux";
import { StoryInterpreterC, StoryInterpreter } from "../../parse-story/storyInterpreter";
import { parseStory } from "../../parse-story/storyParser";
import { IRootState } from "../../store";

const mapStateToProps = (state: IRootState) => {
  return {
    renderTrigger: state.viewEdit.storyReparseToken, // Needed to re-render without story changing.
    storyToParse: state.viewEdit.storyToParse,
  };
};

type RunnerViewOwnProps = {
  /**
   * If provided, parses this story instead of the current one, for e.g. live previews in the UI that won't conflict
   * with the current one being read/written.
   */
  storyToParseOverride?: string;
};

type CombinedProps = RunnerViewOwnProps & ReturnType<typeof mapStateToProps>;

export class RunnerViewC extends React.Component<RunnerViewOwnProps> {
  private interpreterRef: StoryInterpreterC | null = null;

  public componentDidUpdate() {
    this.parse();
  }

  public render() {
    return <StoryInterpreter ref={this.setInterpreterRef} />;
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
        this.interpreterRef.setErrorMessage(ex);
      } else if (ex instanceof Error) {
        this.interpreterRef.setErrorMessage(ex.message);
      }
    }
  }
}

export const RunnerView = connect(mapStateToProps)(RunnerViewC);
