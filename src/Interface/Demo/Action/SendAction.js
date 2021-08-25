export default (wsObj, message, name, steps) => {
  var messages = [];
  messages.push({
    type: "Action",
    vmRecordId: message.VmRecordId,
    data: {
      name: name,
      steps: JSON.stringify(steps),
    },
  });
  wsObj.onmessage({
    data: JSON.stringify(messages),
  });
};
