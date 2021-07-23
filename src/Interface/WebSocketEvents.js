import Interface from ".";
import Alert from "./Alert";
import MessageHandler from "./MessageHandler";

function onConnectionEstablished(e) {
  console.log(e);
  Alert.Show("Connection Established", "success");
  Interface.SendCommand(Interface.Commands.GetPanelDetails);
}
function onConnectionLost(e) {
  console.log(e);
  Alert.Show("Connection Lost", "warning");
}
function onNewMessage(e) {
  MessageHandler.HandleIncomingMessage(e.data);
}

export { onConnectionEstablished, onConnectionLost, onNewMessage };
