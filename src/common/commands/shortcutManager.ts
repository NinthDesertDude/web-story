import { commandIds, commands, ICommand, invokeCommand } from "./CommandHandler";

/** A sequence of consecutive keystrokes that define a shortcut. */
export interface IShortcut {
  /** If defined, this represents a custom preferred shortcut defined by the user. */
  customSequence?: IShortcutStep[];

  disabled?: boolean;

  /**
   * Used only if no custom sequence is defined. This is used to clear user-defined shortcuts. An
   * empty array signifies the shortcut was created entirely by the user.
   */
  originalSequence: IShortcutStep[];
}

/** A single key with optional modifier keys requirements. */
export interface IShortcutStep {
  key: string;
  usesAlt?: boolean;
  usesCtrl?: boolean;
  usesShift?: boolean;
}

interface IMatchProgress {
  shortcut: IShortcut;
  step: number;
}

/** Returns a string representation of the provided shortcut. */
export const getKeyTip = (shortcut: IShortcutStep[]) => {
  let shortcutString = "";

  shortcut.forEach((step: IShortcutStep, index: number) => {
    if (index !== 0) {
      shortcutString += ", ";
    }

    if (step.usesCtrl === true) {
      shortcutString += "Ctrl + ";
    }
    if (step.usesShift === true) {
      shortcutString += "Shift + ";
    }
    if (step.usesAlt === true) {
      shortcutString += "Alt + ";
    }

    shortcutString += step.key.toUpperCase();
  });

  return shortcutString;
};

/** Returns a string representation of the first active shortcut for the given command. */
export const getFirstKeyTip = (command: ICommand) => {
  if (command.shortcuts.length === 0) {
    return "";
  }

  if (command.shortcuts[0].customSequence !== undefined) {
    return getKeyTip(command.shortcuts[0].customSequence);
  }

  return getKeyTip(command.shortcuts[0].originalSequence);
};

/** Begins listening to key presses and invokes matching commands. */
export const listenForShortcuts = () => {
  const commandKeys = Object.keys(commands) as Array<keyof typeof commands>;
  const commandsWithMatchProgress: Partial<{ [key in commandIds]: IMatchProgress[] }> = {};

  // Tracks progress towards executing a command.
  commandKeys.forEach((key: commandIds) => {
    commandsWithMatchProgress[key] = commands[key].shortcuts.map((shortcut: IShortcut) => ({
      shortcut,
      step: 0,
    }));
  });

  window.addEventListener("keypress", (ev: KeyboardEvent) => {
    // For every shortcut on every command.
    commandKeys.forEach((key: commandIds) => {
      const commandProgress = commandsWithMatchProgress[key]!;

      // tslint:disable:prefer-for-of Better performance with return.
      for (let i = 0; i < commandProgress.length; i++) {
        const progress = commandProgress[i];

        if (progress.shortcut.disabled === true) {
          continue;
        }

        // Which keyboard sequence is actually bound to the command.
        const sequence =
          progress.shortcut.customSequence !== undefined
            ? progress.shortcut.customSequence
            : progress.shortcut.originalSequence;

        if (sequence.length === 0) {
          continue;
        }

        // Resets progress towards executing a command if the pressed key is out of sequence.
        if (
          sequence[progress.step].key !== ev.key.toUpperCase() ||
          Boolean(sequence[progress.step].usesAlt) !== ev.altKey ||
          Boolean(sequence[progress.step].usesCtrl) !== ev.ctrlKey ||
          Boolean(sequence[progress.step].usesShift) !== ev.shiftKey
        ) {
          progress.step = 0;
        }

        // Increments the sequence progress or executes the command and returns to avoid redundant
        // execution.
        else {
          if (progress.step === sequence.length - 1) {
            invokeCommand(key);
            progress.step = 0;
            return;
          }

          progress.step++;
        }
      }
    });
  });
};
