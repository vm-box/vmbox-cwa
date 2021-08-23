import React from "react";
import AlertSnackBar from "./Components/AlertSnackBar";
import Interface from "./Interface";
import Panel from "./Panel";

function App() {
  React.useEffect(() => {
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      // Not PWA
      window.IsPwa = false;
    } else {
      // PWA
      window.IsPwa = true;
    }
  }, []);

  return (
    <>
      <AlertSnackBar Agent={Interface.Alert} />
      <Panel />
    </>
  );
}

var qs = Interface.Utils.qs.GetQueries(window.location.search);
if (qs && qs["lang"]) {
  Interface.i18n.Setup(qs["lang"]);
} else {
  Interface.i18n.Setup();
}

var requestedTheme = {};
if (qs) {
  if (qs["theme"]) {
    requestedTheme.requestedTheme = qs["theme"];
  }
  if (qs["theme_mode"]) {
    requestedTheme.requestedMode = qs["theme_mode"];
  }
}
Interface.Theme.Setup(requestedTheme);

export default App;
