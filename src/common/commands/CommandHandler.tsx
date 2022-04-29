import * as React from "react";
import { invokeOpenCommand } from "../../gui/OpenFileHandler";
import { IRootState, store } from "../../store";
import { newStory } from "../../gui/editor/viewedit.actions";
import { isEditMode, isPlayMode, routes } from "../routing/Routing";
import { IShortcut } from "./shortcutManager";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Dispatch } from "redux";
import { connect } from "react-redux";

/** A command is a set of functions executed when the command is invoked by identity. */
export interface ICommand {
  enableWhileTyping?: boolean;
  functionsToInvoke: ICommandFunction[];
  guid: commandIds;
  shortcuts: IShortcut[];
}

/** Contains the event object and/or arbitrary data passed to the called command. */
export interface ICommandFunctionData {
  event?: React.SyntheticEvent;
  data?: any;
}

/** A function that can be executed by a command. */
export type ICommandFunction = (data?: ICommandFunctionData) => void;

/**
 * Commands can be invoked by ID or keyboard shortcuts. Users can define shortcuts, making it
 * valuable to define frequent or important user actions as commands.
 */
export enum commandIds {
  newProject = "newProject",
  openProjectOrGame = "openProjectOrGame",
  saveProjectOrGame = "saveProjectOrGame",
  switchMode = "switchMode",
}

/** The list of all commands and their default shortcuts. */
export const commands: { [key in commandIds]: ICommand } = {
  newProject: {
    functionsToInvoke: [],
    guid: commandIds.newProject as commandIds,
    shortcuts: [
      {
        originalSequence: [{ key: "N", usesShift: true }],
      },
    ],
  },
  openProjectOrGame: {
    functionsToInvoke: [],
    guid: commandIds.openProjectOrGame as commandIds,
    shortcuts: [
      {
        originalSequence: [{ key: "O", usesShift: true }],
      },
    ],
  },
  saveProjectOrGame: {
    functionsToInvoke: [],
    guid: commandIds.saveProjectOrGame as commandIds,
    shortcuts: [
      {
        originalSequence: [{ key: "S", usesShift: true }],
      },
    ],
  },
  switchMode: {
    functionsToInvoke: [],
    guid: commandIds.switchMode as commandIds,
    shortcuts: [
      {
        originalSequence: [{ key: "Q", usesShift: true }],
      },
    ],
  },
};

/** Invokes the command with the given ID. */
export const invokeCommand = (Id: commandIds, data?: ICommandFunctionData) => {
  // Silently consume command invocations that aren't enabled while typing. They still consume keypresses.
  if (
    commands[Id].enableWhileTyping !== true &&
    (document.activeElement?.nodeName.toLowerCase() === "textarea" ||
      (document.activeElement?.nodeName.toLowerCase() === "input" &&
        document.activeElement.getAttribute("type") === "text"))
  ) {
    return;
  }

  commands[Id].functionsToInvoke.forEach((func: ICommandFunction) => func(data));
};

const mapStateToProps = (state: IRootState) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

type CommandHandlerOwnProps = {};
type CommandHandlerPropsWithRouteInfo = CommandHandlerOwnProps & RouteComponentProps;

export class CommandHandlerC extends React.Component<CommandHandlerPropsWithRouteInfo> {
  /** Disabled in play mode. Prompts the author to save unsaved changes, then starts a new project. */
  private actionNewProject() {
    if (isEditMode()) {
      store.dispatch(newStory);
    }
  }

  /**
   * If in play mode, prompts the player to save unsaved progress, then opens a different game.
   * If in edit mode, prompts the author to save unsaved changes, then opens a different game.
   */
  private actionOpenProjectOrGame(data?: { data?: { callback: Function } }) {
    invokeOpenCommand(data?.data?.callback ?? undefined);
  }

  /**
   * If in play mode, may prompt the player for a game progress save location, then saves.
   * If in edit mode, may prompt the author for a project save location, then saves.
   */
  private actionSaveProjectOrGame() {
    if (isPlayMode()) {
      alert("Invoked file -> save game."); //TODO
    } else if (isEditMode()) {
      alert("Invoked file -> save project."); //TODO
    }
  }

  private actionSwitchMode = () => {
    if (isPlayMode()) {
      this.props.history.push(routes.edit);
    } else if (isEditMode()) {
      this.props.history.push(routes.play);
    }
  };

  public componentDidMount() {
    commands.newProject.functionsToInvoke = [this.actionNewProject];
    commands.openProjectOrGame.functionsToInvoke = [this.actionOpenProjectOrGame];
    commands.saveProjectOrGame.functionsToInvoke = [this.actionSaveProjectOrGame];
    commands.switchMode.functionsToInvoke = [this.actionSwitchMode];
  }

  public render() {
    return <></>;
  }
}

/** Hooks up actions, some of which require current state or history, to commands. */
export const CommandHandler = connect(mapStateToProps, mapDispatchToProps)(withRouter(CommandHandlerC));
