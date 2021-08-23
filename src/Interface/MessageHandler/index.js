import Alert from "../Alert";
import MessageTypes from "./types";
import { SubmitNewHandler, Handlers } from "./handlers";

/* Messages will be an Array of JSONs in this format:

[
  {
    type: String, type of the command coming from the server
    data: String, data coming from the server, might be a stringified JSON object
  },
  ...
]

*/
function HandleIncomingMessage(Messages) {
  if (!Messages || typeof Messages !== "string") return;
  try {
    Messages = JSON.parse(Messages);
  } catch (error) {
    console.log(error, `Message`, Messages);
    return;
  }
  if (!Messages || !Messages.length) {
    console.log("Unknown Messages coming from the server");
    return;
  }
  Messages.forEach((Message) => {
    if (
      typeof Message !== "object" ||
      !Message.type ||
      typeof Message.type !== "string"
    ) {
      Alert.Show("Unknown Message coming from the server", "error");
      return;
    }
    if (!Object.keys(MessageTypes).includes(Message.type)) {
      Alert.Show(`Unknown Message Type (${Message.type})`, "error");
      return;
    }
    if (Object.keys(Handlers).includes(Message.type)) {
      var typeHandlers = Handlers[Message.type]; // an array of handlers
      for (var i = 0; i < typeHandlers.length; i++) {
        if (typeof typeHandlers[i] === "function") {
          typeHandlers[i](Message.data, Message.vmRecordId);
        } else {
          console.log(
            `non func type for Message Handler, Type: ${Message.type}`
          );
        }
      }
    } else {
      Alert.Show(`Unhandled Message Type [${Message.type}]`, "error");
    }
  });
}

export default {
  HandleIncomingMessage,
  On: SubmitNewHandler,
  MessageTypes,
};
