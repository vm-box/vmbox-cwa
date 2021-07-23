import Alert from "./Alert";
import Demo from "./Demo";
import {
  onConnectionEstablished,
  onConnectionLost,
  onNewMessage,
} from "./WebSocketEvents";
import Commands from "./commands";
import Requests from "./requests";

// WebSocket connection
var wsConnection = null;

function Setup(wsAddress) {
  if (window.IsDemo) {
    wsConnection = Demo.Setup(wsAddress);
    wsConnection.onclose = onConnectionLost;
    wsConnection.onopen = onConnectionEstablished;
    wsConnection.onmessage = onNewMessage;
    return;
  }
  if (window["WebSocket"]) {
    if (wsAddress.startsWith("{{")) {
      wsAddress = localStorage.getItem("wsAddress");
      if (!wsAddress || typeof wsAddress !== "string") {
        Alert.Show(
          "No WebSocket Address Found, Remove or Refresh tha Web Page",
          "error"
        );
        return;
      }
    } else {
      localStorage.setItem("wsAddress", wsAddress);
    }

    wsConnection = new WebSocket(wsAddress);
    wsConnection.onclose = onConnectionLost;
    wsConnection.onopen = onConnectionEstablished;
    wsConnection.onmessage = onNewMessage;
  } else {
    // TODO: hangle no WebSocket error
    alert("your browser doesn't support WebSocket");
    return;
  }
}

function SendMessageToServer(Message) {
  if (wsConnection) {
    var MessageStr = "";
    if (typeof Message === "object") {
      MessageStr = JSON.stringify(Message);
    } else {
      MessageStr = `${Message}`;
    }
    wsConnection.send(MessageStr);
  } else {
    Alert.Show("WebSocket Connection not ready yet!", "error");
  }
}

function SendCommand(Type, Param, VmRecordId) {
  var Obj = {
    Type: Type,
    Param: Param
      ? typeof Param === "object"
        ? JSON.stringify(Param)
        : `${Param}`
      : "",
    VmRecordId: VmRecordId ? `${VmRecordId}` : "",
  };
  SendMessageToServer(Obj);
}

export default {
  Alert: Alert,
  Conn: wsConnection,
  SendMessageToServer,
  SendCommand,
  Commands: Commands,
  Setup: Setup,
  Requests: Requests,
};
