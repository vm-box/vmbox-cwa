import Alert from "../Alert";
import MessageTypes from "./types";

const Handlers = {
  Message: [
    (data) => {
      // data will be a JSON in format { code int, content string}
      console.log("New Message", data);
    },
  ],
};

function SubmitNewHandler(MessageType, callback) {
  if (!Object.keys(MessageTypes).includes(MessageType)) {
    Alert.Show("DevErr: Unknown Message Type coming from the server", "error");
    return;
  }

  if (Object.keys(Handlers).includes(MessageType)) {
    Handlers[MessageType] = [...Handlers[MessageType], callback];
  } else {
    Handlers[MessageType] = [callback];
  }
}

export { SubmitNewHandler, Handlers };
