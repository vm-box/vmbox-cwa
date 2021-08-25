function GetCdDrives(wsObj, message) {
  var VmRecordId = message.VmRecordId;
  var messages = [];
  messages.push({
    type: "SetCdDrives",
    vmRecordId: VmRecordId,
    data: JSON.stringify([
      { Id: "65", Name: "Windows 8" },
      { Id: "66", Name: "Ubuntu 20" },
    ]),
  });
  setTimeout(() => {
    wsObj.onmessage({
      data: JSON.stringify(messages),
    });
  }, 350);
}

export default GetCdDrives;
