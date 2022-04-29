import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { initializeIcons, loadTheme } from "@fluentui/react";
import { HashRouter } from "react-router-dom";
import { listenForShortcuts } from "./common/commands/shortcutManager";
import { store } from "./store";
import { Themes, themes } from "./common/themes";
import { Routing } from "./common/routing/Routing";

initializeIcons(); // Ensures all icons are available.
listenForShortcuts(); // Hooks up global key listeners.

// Applies the default light theme.
loadTheme(themes[Themes.Default].theme);
document.body.style.backgroundColor = themes[Themes.Default].theme.semanticColors.bodyBackground;

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Routing />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
