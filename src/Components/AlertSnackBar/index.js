import React from "react";
import "./AlertSnackBar.css";

function AlertSnackBar(props) {
  const { Agent } = props;

  Agent.Show = function (Text, Type, Duration) {
    var backgroundColor = "#3b3f5c";
    switch (Type) {
      case "success":
        backgroundColor = "#8dbf42";
        break;
      case "error":
        backgroundColor = "#e7515a";
        break;
      case "info":
        backgroundColor = "#2196f3";
        break;
      case "warning":
        backgroundColor = "#e2a03f";
        break;
    }
    if (!Duration) {
      Duration = 3000;
    }

    // window.Snackbar origin: index.html
    window.Snackbar.show({
      text: Text,
      pos: "top-right",
      backgroundColor: backgroundColor,
      actionTextColor: "#fff",
      duration: Duration,
    });
  };

  window.alert = Agent.Show;

  return <></>;
}

export default AlertSnackBar;
