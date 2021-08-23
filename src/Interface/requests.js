import MessageHandler from "./MessageHandler";
import Interface from ".";
import Alert from "./Alert";

const RequestTypes = {
  CreateSession: "CreateSession",
  SetSessionPass: "SetSessionPass",
  RemoveSession: "RemoveSession",
  CreateWMKSTicket: "CreateWMKSTicket",
};

// an object in format { key:(ReponseCode) => value:(array of Callbacks or a single callback function for OnlyOnce requests) }
const Responses = {};

function ResponseHandler(data) {
  console.log("Responses", Responses);
  if (!data || !data.code) return;
  if (Object.keys(Responses).includes(`${data.code}`)) {
    if (typeof Responses[data.code] === "function") {
      Responses[data.code](data.content);
    } else {
      if (Responses[data.code].length) {
        // take the first cb, run it with content and remove it from the beginning
        Responses[data.code].splice(0, 1)(data.content);
      }
    }
  }
}

function MakeRequest(
  Type,
  { VmRecordId, Param },
  { ResponseCode, Callback, OnlyOnce }
) {
  var cb = (content) => {
    if (typeof Callback === "function") {
      Callback(content);
    }
  };
  if (Object.keys(Responses).includes(ResponseCode)) {
    // there is already some requests made

    // OnlyOnce is true if the Request must be made only once, so the response will be came once too
    if (OnlyOnce) {
      Alert.Show(`${Type} already in progress.`, "warning");
      return;
    }

    if (typeof Responses[ResponseCode].length === "number") {
      Responses[ResponseCode].push(cb);
    } else {
      // since the value is not an array, so
      // there is an OnlyOnce Request with the same ResponseCode in progress
      Alert.Show(`${Type} already in progress.`, "warning");
      return;
    }
  } else {
    if (OnlyOnce) {
      Responses[ResponseCode] = cb;
    } else {
      Responses[ResponseCode] = [cb];
    }
  }

  // Send the Request
  Interface.SendCommand(Type, Param, VmRecordId);
}

MessageHandler.On(MessageHandler.MessageTypes.Message, ResponseHandler);

export default {
  RequestTypes,
  MakeRequest,
};
