import Alert from "./Alert";
import Demo from "./Demo";
import {
  onConnectionEstablished,
  onConnectionLost,
  onConnectionError,
  onNewMessage,
} from "./WebSocketEvents";
import Commands from "./commands";
import Requests from "./requests";
import Utils from "./Utils";
import i18n from "./i18n";
import Theme from "./Theme";
import WMKS from "./WMKS";

// WebSocket connection
var wsConnection = null;
var currentVmRecordId = null;
window.currentWsAddress = "";

function Setup(onOpen, onClose, onError) {
  if (typeof onOpen !== "function") onOpen = () => {};
  if (typeof onClose !== "function") onClose = () => {};
  if (typeof onError !== "function") onError = () => {};

  if (wsConnection) return true;

  var combinedOnOpen = (e) => {
    currentVmRecordId = null;
    onOpen(e);
    onConnectionEstablished(e);
  };
  var combinedOnClose = (e) => {
    onClose(e);
    onConnectionLost(e);
    wsConnection = null;
  };
  var combinedOnError = (e) => {
    onError(e);
    onConnectionError(e);
    wsConnection = null;
  };

  if (window.IsDemo) {
    wsConnection = Demo.Setup();
    wsConnection.onclose = combinedOnClose;
    wsConnection.onopen = combinedOnOpen;
    wsConnection.onmessage = onNewMessage;
    return;
  }

  if (window["WebSocket"]) {
    var wsAddress = "";

    // check if it's PWA
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      // Not PWA
      window.IsPwa = false;
      var queries = Utils.qs.GetQueries(window.location.search);
      if (!queries || !queries["wsAddr"]) {
        // no wsAddress found in the URI, try to fetch it from localStorage
        var localWsAddress = localStorage.getItem("wsAddress");
        if (!localWsAddress || typeof localWsAddress !== "string") {
          return false;
        } else {
          // found it in the localStorage
          wsAddress = localWsAddress;
        }
      } else {
        // found it in the URI
        console.log("Using non-persistent ticket, full access confirmed");
        console.log("wsAddress", queries["wsAddr"]);
        wsAddress = queries["wsAddr"];
      }
    } else {
      // PWA
      window.IsPwa = true;
      // try to fetch the wsAddress from localStorage
      var localWsAddress = localStorage.getItem("wsAddress");
      if (!localWsAddress || typeof localWsAddress !== "string") {
        return false;
      } else {
        // found it in the localStorage
        wsAddress = localWsAddress;
      }
    }

    // save the latest wsAddress
    window.currentWsAddress = wsAddress;

    console.log("Connecting to the Server...");
    wsConnection = new WebSocket(wsAddress);
    wsConnection.onclose = combinedOnClose;
    wsConnection.onopen = combinedOnOpen;
    wsConnection.onerror = combinedOnError;
    wsConnection.onmessage = onNewMessage;
    return true;
  } else {
    Alert.Show("Sorry! your browser doesn't support WebSocket", "error");
    return;
  }
}

function SendMessageToServer(Message) {
  if (wsConnection && wsConnection.send) {
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
    VmRecordId: VmRecordId
      ? `${VmRecordId}`
      : currentVmRecordId
      ? currentVmRecordId
      : "",
  };
  SendMessageToServer(Obj);
}

function IsConnected() {
  return !!wsConnection;
}

function SetCurrentVmRecordId(Id) {
  currentVmRecordId = `${Id}`;
}

export default {
  Alert: Alert,
  Conn: wsConnection,
  IsConnected,
  SetCurrentVmRecordId,
  SendMessageToServer,
  SendCommand,
  Commands: Commands,
  Setup: Setup,
  Requests: Requests,
  Utils,
  i18n,
  Theme,
  WMKS,
};
