import MessageHandler from "./MessageHandler";

function onConnectionEstablished(e) {
  console.log(e);
}
function onConnectionLost(e) {
  console.log(e);
}
function onConnectionError(e) {
  console.log(e);
}
function onNewMessage(e) {
  MessageHandler.HandleIncomingMessage(e.data);
}

export { onConnectionEstablished, onConnectionLost, onConnectionError, onNewMessage };
