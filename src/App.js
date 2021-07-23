import React from "react";
import AlertSnackBar from "./Components/AlertSnackBar";
import Interface from "./Interface";
import Panel from "./Panel";

function App() {
  React.useEffect(() => {
    if (window.PredefinedParams) {
      var wsAddr = window.PredefinedParams["wsAddr"];
      Interface.Setup(wsAddr);
    }
  }, []);

  return (
    <>
      <AlertSnackBar Agent={Interface.Alert} />
      <Panel />
    </>
  );
}

export default App;
